<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false,
    "line_length":200
  },
  "MD033": false,
  "MD041": false
} -->

[license]: /LICENSE
[license-badge]: https://img.shields.io/github/license/jerrykuku/luci-theme-argon?style=flat-square&a=1
[prs]: https://github.com/jerrykuku/luci-theme-argon/pulls
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[issues]: https://github.com/jerrykuku/luci-theme-argon/issues/new
[issues-badge]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square
[release]: https://github.com/jerrykuku/luci-theme-argon/releases
[release-badge]: https://img.shields.io/github/v/release/jerrykuku/luci-theme-argon?style=flat-square
[download]: https://github.com/jerrykuku/luci-theme-argon/releases
[download-badge]: https://img.shields.io/github/downloads/jerrykuku/luci-theme-argon/total?style=flat-square
[contact]: https://t.me/jerryk6
[contact-badge]: https://img.shields.io/badge/Contact-telegram-blue?style=flat-square
[en-us-link]: /README.md
[zh-cn-link]: /README_ZH.md
[en-us-release-log]: /RELEASE.md
[zh-cn-release-log]: /RELEASE_ZH.md
[config-link]: https://github.com/jerrykuku/luci-app-argon-config/releases
[official]: https://github.com/openwrt/openwrt
[immortalwrt]: https://github.com/immortalwrt/immortalwrt

<div align="center">
<img src="https://raw.githubusercontent.com/jerrykuku/staff/master/argon_title4.svg">

# A brand new OpenWrt LuCI theme

Argon is **a clean and tidy OpenWrt LuCI theme** that allows<br/>
users to customize their login interface with images or videos.  
It also supports automatic and manual switching between light and dark modes.

[![license][license-badge]][license]
[![prs][prs-badge]][prs]
[![issues][issues-badge]][issues]
[![release][release-badge]][release]
[![download][download-badge]][download]
[![contact][contact-badge]][contact]

**English** |
[简体中文][zh-cn-link]

[Key Features](#key-features) •
[Compatibility](#compatibility) •
[Version History](#version-history) •
[Getting started](#getting-started) •
[Screenshots](#screenshots) •
[Contributors](#contributors) •
[Credits](#credits)

<img src="https://raw.githubusercontent.com/jerrykuku/staff/master/argon2.gif">
</div>

## Key Features

- Clean and modern Argon-style interface design.
- Fully adapted for both desktop and mobile displays.
- Supports automatic or manual switching between light and dark modes.
- Supports custom theme colors, along with adjustable blur and transparency effects.
- The login page supports local images, videos, and online wallpapers as backgrounds.
- Works with [luci-app-argon-config][config-link] for a more complete theme configuration experience.

Choose **Classic sidebar** (default) or **Centered card** under **System → Argon Config → Login page style**. Both layouts use the same wallpaper, color and authentication settings. Update both the theme and configuration plugin to use the selector; missing or unsupported `login_style` values fall back to `classic`.

Unsplash wallpapers require an Unsplash API access key. The current `luci-app-argon-config` UI does not expose this setting; after choosing Unsplash, set it through UCI:

```sh
uci set 'argon.@global[0].use_api_key=YOUR_UNSPLASH_ACCESS_KEY'
uci commit argon
```

Without a key, the login page uses a local background. Bing and Wallhaven wallpaper options are unaffected.

## Styles and menu icons

Light and dark modes share `htdocs/luci-static/argon/css/cascade.css`. Maintain palette variables in `less/theme.less` and keep one set of component rules. After editing LESS, run `lessc less/cascade.less htdocs/luci-static/argon/css/cascade.css`. Automatic, forced light, forced dark, and custom primary colors remain supported.

Private LESS colors supply semantic tokens. Each row of `@theme-palette` defines one role as `role: light, dark;`; a single value is shared by both modes. Compilation emits only dark-mode differences. Keep text, surface, and border roles separate even when their colors match, and declare menu category colors independently. Legacy color names at the end of the file are LuCI compatibility aliases; components should consume semantic tokens. Theme settings still override `--light-primary`, `--dark-primary`, and blur parameters.

`cascade.less` organizes imports: theme, spacing and shapes → resets and base controls → login and application layout → shared `components/` → page/plugin adapters in `page-fix.less` → viewport adaptations in `responsive.less`. Add general rules to their component file instead of repeating mobile component rules in page patches. Forms, buttons, tabs, tables, and overlays have their own modules. Native tables and LuCI table compatibility are preserved.

Maintain spacing in `less/spacing.less`: `--page-gutter` sets page margins, `--section-inset` aligns card content, and `--section-gap`, `--field-gap`, `--control-gap`, and `--action-gap` space sections, form rows, control groups, and actions. On small screens, `responsive.less` reduces both page margins and card insets to `1rem`. Flex form rows stack according to their container width; action buttons and change legends wrap while preserving long labels.

Maintain corner shapes in `less/shape.less`. With a 16px root font, small labels use 4px, controls and submenu options 6px, menus and small panels 8px, cards 12px, and dialogs and the centered login card 16px. Both themes and all viewports share these tokens. Progress bars and scrollbar thumbs use `--radius-pill`; circular badges use `--radius-circle`. Keep joined control seams square, curve only the top corners of tabs and edge-aligned card headings, and avoid clipping the entire card because dropdowns and tooltips can extend outside it.

Modal layout lives in `components/overlays.less`: titles and paragraphs share an inset, and both native LuCI `.right` and `.button-row` action groups receive spacing. Actions stack when the dialog content is narrow. Keep semantic button classes for apply, positive, and destructive actions; plain actions use neutral styling. Long dialogs scroll through the overlay, while `cbi-modal` retains room for wider forms.

Ordinary form controls retain their 18rem minimum, reduced to 16rem at narrower viewports, and can shrink to fit the field. Notes and output areas keep their intended full width. Escape the CSS `min()` in `forms.less` so LESS does not compile it to `min-width: 100%`.

Menus, dropdown buttons, native selects, sorting controls, and overview disclosures share `chevron-down.svg` and `chevron-right.svg`, using a 24×24 grid and 2px round strokes. Native LuCI Save & Apply buttons open choices only from their arrow region; the body executes the selected apply action. Their default height is 2.5rem, with room to grow for wrapped labels; the unused overflow summary stays hidden for these single-action buttons. Menu chevrons rotate the same SVG over 200ms when opening or closing, allowing smooth reversal, and show the final direction immediately under reduced motion.

Expanded LuCI dropdowns live in `components/dropdowns.less`. Split buttons, device selectors, single/multiple selection, and editable choices share an 8px panel radius, 4px option radius, a thin border, and soft shadows. Ordinary rows are at least 2.5rem high; selected, hover, and keyboard-focus states remain distinct. Long labels wrap, custom inputs shrink, and LuCI keeps control of viewport-aware placement and scroll height. Native HTML select popups retain their browser or system rendering and behavior.

Top-level menu icons resolve `htdocs/luci-static/argon/icon/<node-name>.svg`, such as `status.svg`, `system.svg`, `network.svg`, or `logout.svg`. Names are case-sensitive menu node identifiers, independent of translated labels, and support letters, digits, underscores, and hyphens. Add the matching SVG and reload the page; missing icons use `default.svg`.

Icons use CSS masks so their colors follow the theme and menu states. Use monochrome SVGs with a transparent background and a `viewBox`. This is separate from the browser icon and login logo settings below.

All 28 visible icons in `argon.woff2` are exported to this directory using service or function names, such as `status.svg`, `services.svg`, `docker.svg`, and `user.svg`. Menu icons use these original font outlines. See the [font icon index](htdocs/luci-static/argon/icon/README.md) for previews and code point mappings. The source font is retained for existing font-based icons.

## Custom browser icon and login logo

Under **System → Argon Config → Custom branding**, upload a browser icon and login logo separately, or use one image for both. Each can be restored to its default. PNG images must be 16–1024 pixels per side and at most 1 MiB. Browser icons must be square; login logos retain their aspect ratio in both login layouts.

Update both the theme and configuration plugin. Uploads and resets apply immediately without saving other settings; reload open pages to update their icons. The custom browser icon also supplies the touch icon and web manifest. Existing home-screen shortcuts may need to be added again.

Files are stored in `/www/luci-static/argon/branding/` without replacing packaged assets. The configuration plugin includes this directory in `keep.d` backups for upgrades that preserve configuration. Upgrades without configuration preservation reset the icons.

## Compatibility

Only the `master` branch is maintained now.  
Support is focused on modern LuCI environments based on [Official OpenWrt][official] and [ImmortalWrt][immortalwrt].

## Version History

The latest version is v2.4.8 [Click here][en-us-release-log] to view the full version history record.

## Getting started

### Build from source

```bash
cd openwrt/package
git clone https://github.com/jerrykuku/luci-theme-argon.git
make menuconfig #choose LUCI->Theme->Luci-theme-argon
make -j1 V=s
```

### Choose the package format

Choose the format used by the firmware's native package manager. The presence of an `apk` command alone does not identify it:

| Firmware package manager | Release assets | Install command |
| --- | --- | --- |
| `opkg` (including OpenWrt 23.05, 24.10, and GL.iNet firmware based on these versions) | `.ipk` | `opkg install` |
| OpenWrt / ImmortalWrt using APK v3 natively (`apk-tools 3.x`) | `.apk` | `apk add --allow-untrusted` |

The APK assets use **APK v3 format**, which `apk-tools 2.x` (including `2.14.0`) cannot read. `--allow-untrusted` only bypasses signature trust checks; it does not add format support. `apk` cannot install IPK files either.

APK builds target the OpenWrt **25.12.5 stable SDK** and keep theme templates as source for runtime compatibility. The original v2.4.8 APK was built with a snapshot SDK and requires `ucode>=2026.02.27`, which OpenWrt 25.12.5 does not provide ([#715](https://github.com/jerrykuku/luci-theme-argon/issues/715)). That asset needs to be rebuilt with this fix; updating this repository does not replace already published packages. Do not bypass dependency checks to install incompatible bytecode.

For the GL.iNet / OpenWrt 23.05 environment in [#705](https://github.com/jerrykuku/luci-theme-argon/issues/705), download IPK files and install them with the firmware's existing `opkg`. There is no need to replace the system package manager.

Download `luci-theme-argon`, `luci-app-argon-config`, and any required `luci-i18n-argon-config-<language>` packages from [Releases][release]. Select the same format for all packages and use the actual asset filenames; do not construct version suffixes or rename file extensions.

Put the downloaded files in one empty directory, keeping only one version of each package, then run the appropriate commands from that directory.

### Install release packages (`ipk`)

```bash
opkg update
opkg install ./luci-theme-argon_*.ipk ./luci-app-argon-config_*.ipk
```

If you also downloaded language packages in the same format, install them with:

```bash
opkg install ./luci-i18n-argon-config-*.ipk
```

### Install release packages (`apk`)

Use this only on firmware that natively uses `apk-tools 3.x`. Check the version with `apk --version`.

```bash
apk update
apk add --allow-untrusted ./luci-theme-argon-*.apk ./luci-app-argon-config-*.apk
```

If you also downloaded language packages in the same format, install them with:

```bash
apk add --allow-untrusted ./luci-i18n-argon-config-*.apk
```

If you encounter `IO ERROR`, first use `ls -l ./*.apk` to check that the files exist, their names are correct, and the downloads are complete, then check `apk --version`. Do not force installation to bypass format or dependency errors.


## Screenshots

![desktop](/Screenshots/screenshot_pc.jpg)
![mobile](/Screenshots/screenshot_phone.jpg)

## Contributors

<a href="https://github.com/jerrykuku/luci-theme-argon/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jerrykuku/luci-theme-argon&v=2" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Related Projects

- [luci-app-argon-config](https://github.com/jerrykuku/luci-app-argon-config): Configuration plugin for the Argon theme
- [openwrt-package](https://github.com/jerrykuku/openwrt-package): My OpenWrt package collection
- [CasaOS](https://github.com/IceWhaleTech/CasaOS): A simple, elegant open-source personal cloud system and my current primary project

## Credits

[luci-theme-material](https://github.com/LuttyYang/luci-theme-material/)
