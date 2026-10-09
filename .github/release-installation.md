## Installation / 安装说明

| Firmware / 固件 | Package / 安装包 |
| --- | --- |
| Native `opkg`, including OpenWrt 23.05 / 24.10 and GL.iNet firmware based on them / 原生使用 `opkg` 的固件 | `.ipk` → `opkg install` |
| Native APK v3 with `apk-tools 3.x` / 原生使用 APK v3 的固件 | `.apk` → `apk add --allow-untrusted` |

APK assets use **APK v3** and cannot be read by `apk-tools 2.x`, including `2.14.0`. Having an `apk` command installed on an opkg-based firmware does not make it APK v3 compatible. `--allow-untrusted` does not change format compatibility, and `apk` cannot install IPK files.

APK 附件采用 **APK v3 格式**，`apk-tools 2.x`（包括 `2.14.0`）无法读取。在原生使用 opkg 的固件上额外安装 `apk`，并不会让固件兼容 APK v3；`--allow-untrusted` 不能解决格式不兼容，`apk` 也不能安装 IPK。

APK builds use the OpenWrt **25.12.5 stable SDK**. Theme templates are shipped as source to avoid snapshot-specific ucode bytecode requirements. If an older APK reports `ucode>=2026.02.27`, use a package rebuilt with the [#715 fix](https://github.com/jerrykuku/luci-theme-argon/issues/715); bypassing dependency checks does not make that bytecode compatible.

APK 使用 OpenWrt **25.12.5 稳定版 SDK** 构建，主题模板保留源码，避免 snapshot 的 ucode 字节码版本限制。若旧 APK 提示需要 `ucode>=2026.02.27`，请使用包含 [#715 修复](https://github.com/jerrykuku/luci-theme-argon/issues/715) 的重新构建包；绕过依赖检查不能解决字节码不兼容。

Download the theme, configuration plugin, and required language packages in the **same format**. Use the exact asset filenames below. For GL.iNet / OpenWrt 23.05, use IPK files with the firmware's existing `opkg`.

主题、配置插件和需要的语言包应选择**相同格式**，以本页附件实际文件名为准。GL.iNet / OpenWrt 23.05 请下载 IPK 并使用固件原有的 `opkg` 安装。
