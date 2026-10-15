#!/bin/sh
set -eu

cd "$(dirname "$0")/../.."

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT HUP INT TERM

find htdocs/luci-static/resources -type f -name '*.js' -print |
	while IFS= read -r script; do node --check "$script"; done
for script in root/etc/uci-defaults/* root/usr/libexec/rpcd/*; do
	sh -n "$script"
done

ucode_bin="${UCODE_BIN:-ucode}"
for template in ucode/template/themes/argon/*.ut; do
	"$ucode_bin" -T, -s -cno-interp,dynlink=fs,dynlink=uci,dynlink=luci.core,dynlink=luci.argon-branding,dynlink=luci.argon-palette \
		-o "$tmpdir/$(basename "$template").uc" "$template"
done
# Compile an importing entry point: stable ucode has no standalone module flag.
"$ucode_bin" -L "$(dirname "$ucode_bin")/*.so" -L "$PWD/root/usr/share/ucode/*.uc" -cno-interp,dynlink=fs \
	-o "$tmpdir/argon-branding.uc" -e 'import { get_branding } from "luci.argon-branding";'
"$ucode_bin" -L "$(dirname "$ucode_bin")/*.so" -L "$PWD/root/usr/share/ucode/*.uc" -cno-interp,dynlink=math \
	-o "$tmpdir/argon-palette.uc" -e 'import { dark_palette } from "luci.argon-palette";'

lessc less/cascade.less "$tmpdir/cascade.css"
cmp htdocs/luci-static/argon/css/cascade.css "$tmpdir/cascade.css"

UCODE_BIN="$ucode_bin" node --test tests/*.test.js
python3 -m unittest discover -s tests -p 'test_*.py'
