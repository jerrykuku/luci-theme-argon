#!/usr/bin/env bash

set -euo pipefail

input_version="${1:-}"
if [ -z "${input_version}" ]; then
	echo "Version is required." >&2
	exit 1
fi

tag="${input_version}"
case "${tag}" in
	v*) ;;
	*) tag="v${tag}" ;;
esac

version="${tag#v}"
if ! printf '%s' "${version}" | grep -Eq '^[0-9][0-9A-Za-z._~+-]*$'; then
	echo "Invalid version '${input_version}'." >&2
	exit 1
fi

repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
release_url="https://github.com/${repo}/releases/tag/${tag}"
release_date="${RELEASE_DATE:-$(date +%Y.%m.%d)}"
pkg_release="${PKG_RELEASE_DATE:-$(date +%Y%m%d)}"

update_readme() {
	local file="$1"
	local language="$2"

	case "${language}" in
	en)
		perl -0pi -e "s#The latest version is v[^ ]+ \\[Click here\\]\\[en-us-release-log\\] to view the full version history record\\.#The latest version is ${tag} [Click here][en-us-release-log] to view the full version history record.#g" "${file}"
		;;
	zh)
		perl -0pi -e "s#当前最新的版本为 v[^ ]+ \\[点击这里\\]\\[zh-cn-release-log\\]查看完整的版本历史日志\\.#当前最新的版本为 ${tag} [点击这里][zh-cn-release-log]查看完整的版本历史日志.#g" "${file}"
		;;
	esac

	perl -0pi -e "s#releases/download/v[^/]+/luci-theme-argon_[^[:space:])]+\\.ipk#releases/download/${tag}/luci-theme-argon_${version}-1_all.ipk#g" "${file}"
	perl -0pi -e "s#releases/download/v[^/]+/luci-app-argon-config_[^[:space:])]+\\.ipk#releases/download/${tag}/luci-app-argon-config_${version}-1_all.ipk#g" "${file}"
	perl -0pi -e "s#releases/download/v[^/]+/luci-theme-argon_[^[:space:])]+\\.apk#releases/download/${tag}/luci-theme-argon_${version}-1.apk#g" "${file}"
	perl -0pi -e "s#releases/download/v[^/]+/luci-app-argon-config_[^[:space:])]+\\.apk#releases/download/${tag}/luci-app-argon-config_${version}-1.apk#g" "${file}"
}

upsert_section() {
	local file="$1"
	local body_file="$2"
	local heading
	heading="$(head -n 1 "${body_file}")"

	BODY_CONTENT="$(cat "${body_file}")" HEADING="${heading}" perl -0pi -e '
		my $heading = $ENV{HEADING};
		my $body = $ENV{BODY_CONTENT};
		my $pattern = qr/^\Q$heading\E\n.*?(?=^## |\z)/ms;

		if ($_ =~ $pattern) {
			s/$pattern/$body/ms;
		}
		else {
			s/\A([^\n]*\n)/$1\n$body/s;
		}
	' "${file}"
}

format_notes() {
	local notes="$1"
	if [ -n "${notes}" ]; then
		printf '%s\n' "${notes}" | sed 's/\r$//'
	else
		echo "- Release prepared for ${tag}."
		echo "- Final release assets will be published at: ${release_url}"
	fi
}

sed -i -E "s/^(PKG_VERSION):=.*/\\1:=${version}/" Makefile
sed -i -E "s/^(PKG_RELEASE):=.*/\\1:=${pkg_release}/" Makefile

update_readme "README.md" "en"
update_readme "README_ZH.md" "zh"

tmp_en="$(mktemp)"
tmp_zh="$(mktemp)"

{
	echo "## ${tag} [ ${release_date} ]"
	echo
	format_notes "${NOTES_EN:-}"
	echo
} > "${tmp_en}"

{
	echo "## ${tag} [ ${release_date} ]"
	echo
	format_notes "${NOTES_ZH:-}"
	echo
} > "${tmp_zh}"

upsert_section "RELEASE.md" "${tmp_en}"
upsert_section "RELEASE_ZH.md" "${tmp_zh}"

rm -f "${tmp_en}" "${tmp_zh}"
