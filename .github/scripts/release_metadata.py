#!/usr/bin/env python3
"""Translate release tags into GitHub and OpenWrt package versions."""

import argparse
import re

# Rebuilds published under the same tag must upgrade existing installations.
PACKAGE_REVISIONS = {"2.5.0-beta.1": 2, "3.0.0": 2}


def resolve(tag):
    match = re.fullmatch(
        r"v?([0-9]+(?:\.[0-9]+){1,3})(?:-(alpha|beta|rc)\.([1-9][0-9]*))?", tag
    )
    if not match:
        raise ValueError("Use a version such as v2.5.0 or v2.5.0-beta.1.")

    base, stage, number = match.groups()
    version = tag.removeprefix("v")
    revision = PACKAGE_REVISIONS.get(version, 1)
    apk_version = f"{base}_{stage}{number}" if stage else base
    # A tilde sorts before the final version in opkg. LuCI 23.05 ignores
    # PKG_RELEASE, so include the package revision in PKG_VERSION there.
    ipk_version = (f"{base}~{stage}{number}-{revision}" if stage else
                   f"{base}-{revision}" if revision > 1 else base)
    return {
        "tag": tag,
        "version": version,
        "prerelease": "true" if stage else "false",
        "package_release": str(revision),
        # APK only accepts named suffixes separated by an underscore.
        "apk_version": apk_version,
        "ipk_version": ipk_version,
        "apk_i18n_version": f"{apk_version}-r{revision}",
        # Retain the prefix: it sorts above the broken v3.0.0 "unknown" IPKs.
        "ipk_i18n_version": f"v{ipk_version}",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tag")
    parser.add_argument("--field", choices=resolve("v2.5.0").keys())
    args = parser.parse_args()
    try:
        metadata = resolve(args.tag)
    except ValueError as error:
        parser.error(str(error))
    if args.field:
        print(metadata[args.field])
    else:
        for key, value in metadata.items():
            print(f"{key}={value}")
