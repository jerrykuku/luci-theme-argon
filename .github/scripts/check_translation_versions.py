#!/usr/bin/env python3
"""Reject release translations whose package metadata has the wrong version."""

import argparse
import io
from pathlib import Path
import re
import subprocess
import tarfile


def tar_member(data, prefix):
    with tarfile.open(fileobj=io.BytesIO(data), mode="r:*") as archive:
        for member in archive:
            if member.isfile() and member.name.lstrip("./").startswith(prefix):
                return archive.extractfile(member).read()
    raise ValueError(f"Missing {prefix} in IPK archive")


def ipk_metadata(path):
    data = path.read_bytes()
    if data.startswith(b"!<arch>\n"):
        offset = 8
        control = None
        while offset + 60 <= len(data):
            header = data[offset:offset + 60]
            size = int(header[48:58])
            name = header[:16].decode().strip().rstrip("/")
            offset += 60
            if name.startswith("control.tar"):
                control = data[offset:offset + size]
                break
            offset += size + size % 2
        if control is None:
            raise ValueError("Missing control.tar in IPK archive")
    else:
        control = tar_member(data, "control.tar")
    fields = {}
    for line in tar_member(control, "control").decode().splitlines():
        if line and not line[0].isspace() and ":" in line:
            key, value = line.split(":", 1)
            fields[key] = value.strip()
    return fields.get("Package"), fields.get("Version")


def apk_metadata(dump):
    fields = dict(re.findall(r"^  (name|version): (\S+)\s*$", dump, re.M))
    return fields.get("name"), fields.get("version")


def verify(directory, package_format, packages, expected_version, apk_tool="apk"):
    if not packages or len(packages) != len(set(packages)):
        raise ValueError("Translation manifest must contain unique package names")
    for package in packages:
        pattern = f"{package}-*.apk" if package_format == "apk" else f"{package}_*.ipk"
        paths = sorted(directory.glob(pattern))
        if len(paths) != 1:
            raise ValueError(f"{package}: expected one {package_format} asset, found {len(paths)}")
        path = paths[0]
        if package_format == "ipk":
            name, version = ipk_metadata(path)
        else:
            result = subprocess.run([apk_tool, "adbdump", str(path)],
                                    capture_output=True, text=True, check=True)
            name, version = apk_metadata(result.stdout)
        if name != package or version != expected_version:
            raise ValueError(f"{path.name}: expected {package} version {expected_version}, "
                             f"got {name} version {version}")
        print(f"Verified {package_format}: {name} {version}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--format", choices=["ipk", "apk"], required=True)
    parser.add_argument("--directory", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--expected-version", required=True)
    parser.add_argument("--apk-tool", default="apk")
    args = parser.parse_args()
    packages = [line.strip() for line in args.manifest.read_text().splitlines() if line.strip()]
    try:
        verify(args.directory, args.format, packages, args.expected_version, args.apk_tool)
    except (OSError, ValueError, tarfile.TarError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"::error::Translation package verification failed: {error}\n")


if __name__ == "__main__":
    main()
