#!/usr/bin/env python3
"""Build a static update manifest from verified, published release packages."""

import argparse
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

from release_metadata import resolve


def source_url(value):
    if not value:
        return ''
    parsed = urlsplit(value)
    if (len(value) > 512 or parsed.scheme != 'https' or not parsed.hostname or
            parsed.username or parsed.password or parsed.port or parsed.query or parsed.fragment or
            not re.fullmatch(r'https://[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?(?:/[A-Za-z0-9._~-]+)+', value)):
        raise ValueError('Update sources must be complete HTTPS URLs without credentials, ports, queries or fragments.')
    return value


def configure_sources(primary, fallback, output):
    sources = {'primary': source_url(primary), 'fallback': source_url(fallback)}
    if not sources['fallback']:
        raise ValueError('A fallback update source is required.')
    if sources['primary'] == sources['fallback']:
        sources['primary'] = ''
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(sources, indent=2) + '\n')


def generate(release, packages, repository, output):
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repository):
        raise ValueError('Invalid repository name.')
    tag = release.get('tag_name', '')
    metadata = resolve(tag)
    if metadata['prerelease'] != 'false' or release.get('draft') is not False or release.get('prerelease') is not False:
        raise ValueError('Only published stable releases can update the stable channel.')
    published_at = release.get('published_at', '')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z', published_at):
        raise ValueError('A publication timestamp is required.')
    if release.get('html_url') != f'https://github.com/{repository}/releases/tag/{tag}':
        raise ValueError('The release does not belong to the expected repository.')
    notes = release.get('body') or ''
    if not isinstance(notes, str):
        raise ValueError('Release notes must be text.')
    manifest = {'schema': 1, 'repository': repository, 'tag': tag,
                'published_at': published_at, 'notes': notes[:32768]}
    names = {
        'ipk': f'luci-theme-argon_{metadata["ipk_version"]}_all.ipk',
        'apk': f'luci-theme-argon-{metadata["apk_version"]}-r{metadata["package_release"]}.apk',
    }
    assets = release.get('assets', [])
    def verified_asset(name, maximum=8388608):
        matching = [asset for asset in assets if asset.get('name') == name]
        path = packages / name
        if len(matching) != 1 or not path.is_file() or path.is_symlink():
            raise ValueError(f'Expected exactly one published package and local file: {name}')
        size = path.stat().st_size
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if not 0 < size <= maximum:
            raise ValueError(f'Invalid package size: {name}')
        if matching[0].get('size') != size or matching[0].get('digest') != 'sha256:' + digest:
            raise ValueError(f'Published package size or SHA256 differs: {name}')
        return name, digest, size

    for kind, name in names.items():
        manifest[kind], manifest[kind + '_sha256'], manifest[kind + '_size'] = verified_asset(name)

    # Optional for older releases; every published translation must have both
    # formats so a router can keep its language when crossing firmware feeds.
    languages = set()
    patterns = [
        re.compile(r'luci-i18n-argon-config-([a-z]{2,3}(?:-[a-z0-9]{2,8})?)_'
                   + re.escape(metadata['ipk_i18n_version']) + r'_all\.ipk'),
        re.compile(r'luci-i18n-argon-config-([a-z]{2,3}(?:-[a-z0-9]{2,8})?)-'
                   + re.escape(metadata['apk_i18n_version']) + r'\.apk'),
    ]
    for asset in assets:
        name = asset.get('name', '')
        if not name.startswith('luci-i18n-argon-config-'):
            continue
        match = next((m for pattern in patterns if (m := pattern.fullmatch(name))), None)
        if not match:
            raise ValueError(f'Unexpected translation package: {name}')
        languages.add(match[1])
    if len(languages) > 32:
        raise ValueError('Too many translation packages.')
    if languages:
        manifest['translations'] = {}
    for language in sorted(languages):
        entry = {}
        for kind, name in {
            'ipk': f'luci-i18n-argon-config-{language}_{metadata["ipk_i18n_version"]}_all.ipk',
            'apk': f'luci-i18n-argon-config-{language}-{metadata["apk_i18n_version"]}.apk',
        }.items():
            entry[kind], entry[kind + '_sha256'], entry[kind + '_size'] = verified_asset(name, 1048576)
        manifest['translations'][language] = entry

    output.mkdir(parents=True, exist_ok=True)
    (output / 'updates').mkdir(exist_ok=True)
    (output / 'updates/stable.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    (output / '.nojekyll').touch()
    (output / '404.html').write_text('<!doctype html><title>Not found</title><p>Not found.</p>\n')
    (output / '_headers').write_text(
        '/updates/stable.json\n'
        '  Content-Type: application/json; charset=utf-8\n'
        '  Cache-Control: public, max-age=300, must-revalidate\n'
        '  X-Content-Type-Options: nosniff\n')
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    sources = commands.add_parser('sources', help='Configure URLs included in a theme build.')
    sources.add_argument('--primary', default='')
    sources.add_argument('--fallback', default='https://jerrykuku.github.io/luci-theme-argon/updates/stable.json')
    sources.add_argument('--output', type=Path, required=True)
    site = commands.add_parser('site', help='Generate a Pages artifact from an official release.')
    site.add_argument('--release', type=Path, required=True)
    site.add_argument('--packages', type=Path, required=True)
    site.add_argument('--repository', default='jerrykuku/luci-theme-argon')
    site.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    try:
        if args.command == 'sources':
            configure_sources(args.primary, args.fallback, args.output)
        else:
            generate(json.loads(args.release.read_text()), args.packages, args.repository, args.output)
    except (ValueError, OSError) as error:
        parser.error(str(error))


if __name__ == '__main__':
    main()
