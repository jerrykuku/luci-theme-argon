#!/usr/bin/env bash
set -euo pipefail

remote="${1:?Config repository URL is required}"
tag="${2:?Release tag is required}"
prerelease="$(python3 "$(dirname "$0")/release_metadata.py" "$tag" --field prerelease)"
ref="refs/tags/${tag}"
refs="$(git ls-remote "$remote" "$ref" "${ref}^{}")"
sha="$(printf '%s\n' "$refs" | awk -v ref="${ref}^{}" '$2 == ref { print $1 }')"
if [ -z "$sha" ]; then
  sha="$(printf '%s\n' "$refs" | awk -v ref="$ref" '$2 == ref { print $1 }')"
fi
if [ -z "$sha" ]; then
  if [ "$prerelease" = true ]; then
    echo "::error::Push the matching config tag '${tag}' before releasing the theme."
    exit 1
  fi
  ref=refs/heads/master
  sha="$(git ls-remote "$remote" "$ref" | awk -v ref="$ref" '$2 == ref { print $1 }')"
fi
if ! printf '%s' "$sha" | grep -Eq '^[0-9a-f]{40}$'; then
  echo "::error::Unable to resolve config source."
  exit 1
fi
echo "sha=$sha"
echo "Config source: ${sha} (${ref})" >&2
