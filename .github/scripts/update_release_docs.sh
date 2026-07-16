#!/usr/bin/env bash

set -euo pipefail

tag="${1:-${GITHUB_REF_NAME:-}}"
if [ -z "${tag}" ]; then
	echo "Tag name is required." >&2
	exit 1
fi

version="${tag#v}"
release_date="${RELEASE_DATE:-$(date +%Y.%m.%d)}"
pkg_release="${PKG_RELEASE_DATE:-$(date +%Y%m%d)}"
repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
api_url="https://api.github.com/repos/${repo}/releases/tags/${tag}"

release_json="$(
	curl -fsSL \
		-H "Authorization: Bearer ${GITHUB_TOKEN}" \
		-H "Accept: application/vnd.github+json" \
		"${api_url}"
)"

release_url="$(printf '%s' "${release_json}" | jq -r '.html_url')"
release_body="$(printf '%s' "${release_json}" | jq -r '.body // ""')"

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
	local body_file="$3"
	local heading="$2"

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

sed -i -E "s/^(PKG_VERSION):=.*/\\1:=${version}/" Makefile
sed -i -E "s/^(PKG_RELEASE):=.*/\\1:=${pkg_release}/" Makefile

update_readme "README.md" "en"
update_readme "README_ZH.md" "zh"

tmp_en="$(mktemp)"
tmp_zh="$(mktemp)"

{
	echo "## ${tag} [ ${release_date} ]"
	echo
	if [ -n "${release_body}" ]; then
		printf '%s\n' "${release_body}" | sed 's/^## /### /'
	else
		echo "- See the GitHub Release page for details: ${release_url}"
	fi
	echo
} > "${tmp_en}"

{
	echo "## ${tag} [ ${release_date} ]"
	echo
	echo "- GitHub Release: ${release_url}"
	echo "- 详细更新内容请以 Release 页面为准。"
	echo
} > "${tmp_zh}"

upsert_section "RELEASE.md" "## ${tag} [ ${release_date} ]" "${tmp_en}"
upsert_section "RELEASE_ZH.md" "## ${tag} [ ${release_date} ]" "${tmp_zh}"

rm -f "${tmp_en}" "${tmp_zh}"
