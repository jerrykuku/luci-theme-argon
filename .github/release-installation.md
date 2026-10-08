## Installation / 安装说明

| Firmware / 固件 | Package / 安装包 |
| --- | --- |
| Native `opkg`, including OpenWrt 23.05 / 24.10 and GL.iNet firmware based on them / 原生使用 `opkg` 的固件 | `.ipk` → `opkg install` |
| Native APK v3 with `apk-tools 3.x` / 原生使用 APK v3 的固件 | `.apk` → `apk add --allow-untrusted` |

APK assets use **APK v3** and cannot be read by `apk-tools 2.x`, including `2.14.0`. Having an `apk` command installed on an opkg-based firmware does not make it APK v3 compatible. `--allow-untrusted` does not change format compatibility, and `apk` cannot install IPK files.

APK 附件采用 **APK v3 格式**，`apk-tools 2.x`（包括 `2.14.0`）无法读取。在原生使用 opkg 的固件上额外安装 `apk`，并不会让固件兼容 APK v3；`--allow-untrusted` 不能解决格式不兼容，`apk` 也不能安装 IPK。

Download the theme, configuration plugin, and required language packages in the **same format**. Use the exact asset filenames below. For GL.iNet / OpenWrt 23.05, use IPK files with the firmware's existing `opkg`.

主题、配置插件和需要的语言包应选择**相同格式**，以本页附件实际文件名为准。GL.iNet / OpenWrt 23.05 请下载 IPK 并使用固件原有的 `opkg` 安装。
