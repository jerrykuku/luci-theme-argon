#!/usr/bin/env python3
"""Publish the verified Pages artifact to a dedicated Cloudflare Git branch."""

import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
from urllib.error import URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

BRANCH = 'updates'
MARKER = b'argon-update-feed-v1\n'
FILES = {'.nojekyll', '404.html', '_headers', 'updates/stable.json'}


def git(repository, *arguments, env=None, data=None, check=True):
    return subprocess.run(['git', '-C', str(repository), *arguments], input=data,
                          capture_output=True, env=env, check=check)


def publish(site, repository, remote='origin'):
    paths = {path.relative_to(site).as_posix(): path for path in site.rglob('*') if path.is_file()}
    if set(paths) != FILES or any(path.is_symlink() for path in site.rglob('*')):
        raise ValueError('The update artifact must contain only the generated feed files.')
    manifest = json.loads(paths['updates/stable.json'].read_text())
    tag = manifest.get('tag', '')
    if manifest.get('schema') != 1 or not re.fullmatch(r'v?[0-9]+(?:\.[0-9]+){1,3}', tag):
        raise ValueError('The artifact must contain a stable version manifest.')

    reference = f'refs/heads/{BRANCH}'
    existing = git(repository, 'ls-remote', '--exit-code', '--heads', remote, reference, check=False)
    if existing.returncode not in (0, 2):
        raise RuntimeError('Unable to read the update branch from the remote.')
    parent = None
    if existing.returncode == 0:
        git(repository, 'fetch', '--no-tags', '--depth=1', remote, reference)
        parent = git(repository, 'rev-parse', 'FETCH_HEAD').stdout.decode().strip()
        marker = git(repository, 'show', f'{parent}:.argon-update-feed', check=False)
        if marker.returncode != 0 or marker.stdout != MARKER:
            raise ValueError('The existing updates branch is not managed by this publisher; refusing to replace it.')

    with tempfile.TemporaryDirectory(prefix='argon-update-index-') as temporary:
        env = dict(os.environ, GIT_INDEX_FILE=str(Path(temporary) / 'index'),
                   GIT_AUTHOR_NAME='github-actions[bot]', GIT_COMMITTER_NAME='github-actions[bot]',
                   GIT_AUTHOR_EMAIL='41898282+github-actions[bot]@users.noreply.github.com',
                   GIT_COMMITTER_EMAIL='41898282+github-actions[bot]@users.noreply.github.com')
        git(repository, 'read-tree', '--empty', env=env)
        files = {name: path.read_bytes() for name, path in paths.items()}
        files['.argon-update-feed'] = MARKER
        for name, content in sorted(files.items()):
            blob = git(repository, 'hash-object', '-w', '--stdin', data=content).stdout.decode().strip()
            git(repository, 'update-index', '--add', '--cacheinfo', '100644', blob, name, env=env)
        tree = git(repository, 'write-tree', env=env).stdout.decode().strip()
        if parent and tree == git(repository, 'rev-parse', f'{parent}^{{tree}}').stdout.decode().strip():
            return parent, False
        parents = ['-p', parent] if parent else []
        commit = git(repository, 'commit-tree', tree, *parents, env=env,
                     data=f'Publish Argon update feed for {tag}\n'.encode()).stdout.decode().strip()
        # A regular fast-forward push preserves history and rejects races. The
        # caller's branch, working tree and index are never checked out or reset.
        git(repository, 'push', remote, f'{commit}:{reference}')
        return commit, True


def trigger_hook(url):
    if not url:
        return False
    parsed = urlsplit(url)
    if (parsed.scheme != 'https' or parsed.netloc != 'api.cloudflare.com' or parsed.query or parsed.fragment or
            not re.fullmatch(r'/client/v4/pages/webhooks/deploy_hooks/[A-Za-z0-9_-]+', parsed.path)):
        raise ValueError('CF_PAGES_DEPLOY_HOOK must be the HTTPS Deploy Hook URL copied from Cloudflare.')
    try:
        with urlopen(Request(url, data=b'', method='POST'), timeout=30) as response:
            if not 200 <= response.status < 300:
                raise RuntimeError('Cloudflare did not accept the deploy hook request.')
    except (URLError, OSError):
        # HTTP errors include the secret URL. Keep it out of workflow output.
        raise RuntimeError('Cloudflare deploy hook request failed; check its configuration and retry.') from None
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, required=True)
    parser.add_argument('--repository', type=Path, default=Path('.'))
    args = parser.parse_args()
    try:
        commit, changed = publish(args.site, args.repository)
        print(f'Update branch {BRANCH}: {commit} ({"published" if changed else "unchanged"}).')
        if trigger_hook(os.environ.get('CF_PAGES_DEPLOY_HOOK', '')):
            print('Cloudflare accepted the deployment trigger. Check Pages for the build result.')
        elif changed:
            print('Cloudflare Git integration can deploy the new updates commit automatically.')
        else:
            print('No new commit; use a Deploy Hook or retry the build in Cloudflare to redeploy.')
    except (ValueError, OSError, RuntimeError, subprocess.CalledProcessError) as error:
        message = 'Git publication failed; the remote branch was not force-updated.' if isinstance(error, subprocess.CalledProcessError) else str(error)
        parser.error(message)


if __name__ == '__main__':
    main()
