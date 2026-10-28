## Fixed / 修复

- Fix mobile sidebar controls that could fail to open, including in Chrome.
- Keep overview port counters and Wi-Fi signal/noise readings readable in narrow layouts and with larger text.
- Prevent wireless client Disconnect menu buttons from wrapping vertically; improve the layout of network names, MAC addresses and host details.
- Refresh stylesheet cache keys when CSS changes, including source rebuilds using the same package version.
- Correct card layouts and spacing on system logs, processes, package management, cron, SSH access, public keys, diagnostics and reboot pages.
- Improve OpenClash update/log pages, Wake on LAN settings/output and Tailscale status/device tables, including both Services and VPN menu paths.

- 修复手机侧栏菜单可能无法打开的问题，包括 Chrome 浏览器下的点击响应。
- 改善概览端口收发计数与 Wi-Fi 信号／噪声显示，兼顾窄屏和大字号。
- 修复无线客户端 Disconnect 菜单按钮文字竖排，优化网络名称、MAC 地址与主机信息布局。
- CSS 更新时自动变更缓存标识，覆盖使用相同包版本号重新编译的情况。
- 修正系统日志、进程、软件包管理、计划任务、SSH 管理、公钥、网络诊断及重启页面的卡片布局和间距。
- 改善 OpenClash 更新／日志、网络唤醒设置／输出及 Tailscale 状态／设备表格，兼容 Services 与 VPN 两种菜单路径。

## Upgrade notes / 升级说明

Users on v3.1.0 can upgrade through **System → Argon Config → Theme updates**. Users on v3.0.0 or earlier must install v3.1.1 manually once. Online installation updates the theme package and preserves settings; install separate translation packages in the usual way.

v3.1.0 用户可通过**系统 → Argon 配置 → 主题更新**升级。v3.0.0 及更早版本用户需先手动安装一次 v3.1.1。在线安装更新主题主包并保留设置；独立语言包仍按原方式安装。

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
