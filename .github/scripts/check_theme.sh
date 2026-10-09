#!/bin/sh
set -eu

cd "$(dirname "$0")/../.."

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT HUP INT TERM

node --check htdocs/luci-static/resources/menu-argon.js
sh -n root/etc/uci-defaults/30_luci-theme-argon
sh -n root/usr/libexec/rpcd/luci.argon_wallpaper

ucode_bin="${UCODE_BIN:-ucode}"
for template in ucode/template/themes/argon/*.ut; do
	"$ucode_bin" -T, -s -cno-interp,dynlink=fs,dynlink=uci,dynlink=luci.core,dynlink=luci.argon-branding \
		-o "$tmpdir/$(basename "$template").uc" "$template"
done
# Compile an importing entry point: stable ucode has no standalone module flag.
"$ucode_bin" -L "$(dirname "$ucode_bin")/*.so" -L "$PWD/root/usr/share/ucode/*.uc" -cno-interp,dynlink=fs \
	-o "$tmpdir/argon-branding.uc" -e 'import { get_branding } from "luci.argon-branding";'

lessc less/cascade.less "$tmpdir/cascade.css"
cmp htdocs/luci-static/argon/css/cascade.css "$tmpdir/cascade.css"

lessc less/dark.less "$tmpdir/dark-expanded.css"
if command -v cleancss >/dev/null 2>&1; then
	cleancss -o "$tmpdir/dark.css" "$tmpdir/dark-expanded.css"
else
	npx --yes clean-css-cli@5.6.3 -o "$tmpdir/dark.css" "$tmpdir/dark-expanded.css"
fi
cmp htdocs/luci-static/argon/css/dark.css "$tmpdir/dark.css"

UCODE_BIN="$ucode_bin" node --test tests/*.test.js
