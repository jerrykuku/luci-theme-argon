## Added / 新功能

- Add stable release checks and online theme installation under **System → Argon Config → Theme updates**, using the firmware's native APK or OPKG package manager and preserving Argon settings.
- Verify package SHA256 and size before installation, reject downgrades, and show installation progress and logs with monitoring that resumes after a page refresh.

- 新增稳定版检查与在线安装，可在**系统 → Argon 配置 → 主题更新**中通过固件原生 APK 或 OPKG 包管理器升级，并保留 Argon 设置。
- 新增安装包校验、降级保护、安装进度和日志，刷新页面后可继续跟踪安装状态。

## Changed / 改进

- Improve compatibility with stable OpenWrt firmware.

- 改善稳定版 OpenWrt 固件上的兼容性。

## Fixed / 修复

- Fix dashboard action spacing and overview layouts.
- Fix dynamic list controls and custom IP/MAC input borders across narrow screens, light/dark modes and RTL layouts.

- 修复 Dashboard 操作区间距和概览布局。
- 修复动态列表控件及自定义 IP/MAC 输入框边框，兼顾窄屏、亮暗色和 RTL 布局。

## Upgrade notes / 升级说明

**First upgrade:** users on v3.0.0 or earlier must install v3.1.0 manually once. Later releases can be installed through Theme updates. Online installation updates the theme package; install separate translation packages in the usual way.

**首次升级：** v3.0.0 及更早版本用户需先手动安装一次 v3.1.0，之后可使用主题更新功能在线升级。在线安装仅更新主题主包，独立语言包仍按原方式安装。

## Installation / 安装说明

| Firmware / 固件 | Package / 安装包 |
| --- | --- |
| Native `opkg`, including OpenWrt 23.05 / 24.10 and GL.iNet firmware based on them / 原生使用 `opkg` 的固件 | `.ipk` → `opkg install` |
| Native APK v3 with `apk-tools 3.x` / 原生使用 APK v3 的固件 | `.apk` → `apk add --allow-untrusted` |

APK assets use **APK v3** and cannot be read by `apk-tools 2.x`, including `2.14.0`. Having an `apk` command installed on an opkg-based firmware does not make it APK v3 compatible. `--allow-untrusted` does not change format compatibility, and `apk` cannot install IPK files.

APK 附件采用 **APK v3 格式**，`apk-tools 2.x`（包括 `2.14.0`）无法读取。在原生使用 opkg 的固件上额外安装 `apk`，并不会让固件兼容 APK v3；`--allow-untrusted` 不能解决格式不兼容，`apk` 也不能安装 IPK。

APK builds use the OpenWrt **25.12.5 stable SDK**. Theme templates are shipped as source to avoid snapshot-specific ucode bytecode requirements. If an older APK reports `ucode>=2026.02.27`, use a package rebuilt with the [#715 fix](https://github.com/jerrykuku/luci-theme-argon/issues/715); bypassing dependency checks does not make that bytecode compatible.

APK 使用 OpenWrt **25.12.5 稳定版 SDK** 构建，主题模板保留源码，避免 snapshot 的 ucode 字节码版本限制。若旧 APK 提示需要 `ucode>=2026.02.27`，请使用包含 [#715 修复](https://github.com/jerrykuku/luci-theme-argon/issues/715) 的重新构建包；绕过依赖检查不能解决字节码不兼容。

Download the theme and required language packages in the **same format**. Use the exact asset filenames below. For GL.iNet / OpenWrt 23.05, use IPK files with the firmware's existing `opkg`.

主题和需要的语言包应选择**相同格式**，以本页附件实际文件名为准。GL.iNet / OpenWrt 23.05 请下载 IPK 并使用固件原有的 `opkg` 安装。

### Argon 3.0 settings integration / 设置集成

Settings are included in `luci-theme-argon`. Fresh installations need only the theme and desired `luci-i18n-argon-config-*` translations.

设置已内置主题，新安装无需配置插件。已有旧插件时，先单独安装本次发行的 `luci-app-argon-config` 空兼容包，再安装主题；该顺序会保留旧配置并完成文件归属交接。

For an existing configuration plugin, install this release's empty `luci-app-argon-config` compatibility package first, then install the theme in a separate command. Do not install both in one transaction or force overwrites.
