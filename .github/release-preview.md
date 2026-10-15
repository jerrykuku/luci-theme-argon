## 预览版 / Preview

- Argon 设置已集成到主题：配色、登录样式、背景和自定义图标在同一版本中维护。
- 新安装只需主题和所需语言包。
- 已安装旧配置插件时，先安装同一发行版的 `luci-app-argon-config` 空兼容包，再单独升级主题，以保留配置并交接文件。不要合并为同一次安装或强制覆盖。

- Argon settings, wallpaper uploads, login layouts, and branding are included in the theme.
- Fresh installations need only the theme and desired language packages.
- If the older configuration plugin is installed, install this release's empty `luci-app-argon-config` compatibility package first, then upgrade the theme in a separate command to preserve configuration and transfer file ownership.

| 固件包管理器 / Package manager | 安装包 / Package |
| --- | --- |
| `opkg` | `.ipk` |
| `apk`（3.x） | `.apk` |

所有安装包请选择相同格式。/ Use the same package format throughout.
