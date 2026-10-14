# Argon font icons / 字体图标

`../fonts/argon.woff2` 中全部 **28 个可见图标**已按原始矢量轮廓导出。文件名使用实际服务或功能名称，例如 `status.svg`、`services.svg`、`docker.svg`；Unicode 编码仅保留在对照表中。每个 SVG 都有透明背景、`viewBox` 和 `fill="currentColor"`，可用于 CSS mask 或内联 SVG。

All **28 visible icons** from `../fonts/argon.woff2` are exported with their original vector outlines. Filenames use service or function names, such as `status.svg`, `services.svg`, and `docker.svg`; Unicode code points are kept in the mapping. Each SVG has a transparent background, a `viewBox`, and `fill="currentColor"`, suitable for CSS masks or inline SVG.

字体共有 33 个字形；`.notdef`、`uni0000`、`nonmarkingreturn`、`uni0001`、`space` 没有可见轮廓，无需生成空 SVG。[font-icons.json](font-icons.json) 记录完整的编码、字形名、文件名、画布尺寸和源字体 SHA-256。画布保留字体坐标与留白，并扩展至包含越界轮廓，避免裁切。

The font contains 33 glyphs. The five invisible glyphs listed above have no SVG output. [font-icons.json](font-icons.json) records code points, glyph names, filenames, canvas sizes, and the source font SHA-256. View boxes preserve font spacing and expand where an outline exceeds the original em square.

一级菜单按节点名称直接匹配 SVG，例如状态 → `status.svg`、系统 → `system.svg`、服务 → `services.svg`、网络 → `network.svg`、Docker → `docker.svg`。缺失时使用 `default.svg`（原字体的软件包图标）。现有菜单文件已统一为字体导出的原始图形。登录、移动菜单等位置仍引用字体，因此源字体继续保留。

Top-level menus match their node names directly, for example `status.svg`, `system.svg`, `services.svg`, `network.svg`, and `docker.svg`. Missing icons use `default.svg`, the original package glyph. Existing menu assets now use the original font outlines. The font is retained for current login, mobile menu, and other font-based icons.

| 预览 / Preview | 编码 / Code point | SVG | 图形 / Shape |
| --- | --- | --- | --- |
| <img src="chevron-down.svg" width="32" height="32" alt="Chevron down"> | `U+E20B` | [chevron-down.svg](chevron-down.svg) | 下箭头 / Chevron down |
| <img src="menu.svg" width="32" height="32" alt="Menu"> | `U+E20E` | [menu.svg](menu.svg) | 菜单 / Menu |
| <img src="heart.svg" width="32" height="32" alt="Heart"> | `U+E291` | [heart.svg](heart.svg) | 心形 / Heart |
| <img src="ring.svg" width="32" height="32" alt="Ring"> | `U+E603` | [ring.svg](ring.svg) | 环形 / Ring |
| <img src="delete.svg" width="32" height="32" alt="Trash"> | `U+E900` | [delete.svg](delete.svg) | 删除 / Trash |
| <img src="edit.svg" width="32" height="32" alt="Edit"> | `U+E901` | [edit.svg](edit.svg) | 编辑 / Edit |
| <img src="check.svg" width="32" height="32" alt="Check"> | `U+E902` | [check.svg](check.svg) | 勾选 / Check |
| <img src="loading.svg" width="32" height="32" alt="Loading dots"> | `U+E903` | [loading.svg](loading.svg) | 加载圆点 / Loading dots |
| <img src="transfer.svg" width="32" height="32" alt="Transfer arrows"> | `U+E904` | [transfer.svg](transfer.svg) | 上传下载 / Transfer arrows |
| <img src="close.svg" width="32" height="32" alt="Close"> | `U+E905` | [close.svg](close.svg) | 关闭 / Close |
| <img src="status.svg" width="32" height="32" alt="Dashboard"> | `U+E906` | [status.svg](status.svg) | 状态 / Dashboard |
| <img src="logout.svg" width="32" height="32" alt="Log out"> | `U+E907` | [logout.svg](logout.svg) | 退出 / Log out |
| <img src="network.svg" width="32" height="32" alt="Network"> | `U+E908` | [network.svg](network.svg) | 网络 / Network |
| <img src="services.svg" width="32" height="32" alt="Services"> | `U+E909` | [services.svg](services.svg) | 服务 / Services |
| <img src="system.svg" width="32" height="32" alt="System"> | `U+E90A` | [system.svg](system.svg) | 系统 / System |
| <img src="vpn.svg" width="32" height="32" alt="VPN"> | `U+E90B` | [vpn.svg](vpn.svg) | VPN |
| <img src="nas.svg" width="32" height="32" alt="Database"> | `U+E90C` | [nas.svg](nas.svg) | 存储服务 / NAS |
| <img src="bandwidth_monitor.svg" width="32" height="32" alt="Bandwidth monitor"> | `U+E90D` | [bandwidth_monitor.svg](bandwidth_monitor.svg) | 带宽监控 / Bandwidth monitor |
| <img src="hello-world.svg" width="32" height="32" alt="Hello world"> | `U+E90E` | [hello-world.svg](hello-world.svg) | Hello world |
| <img src="chevron-right.svg" width="32" height="32" alt="Chevron right"> | `U+E90F` | [chevron-right.svg](chevron-right.svg) | 右箭头 / Chevron right |
| <img src="password.svg" width="32" height="32" alt="Unlocked padlock"> | `U+E910` | [password.svg](password.svg) | 密码 / Unlocked padlock |
| <img src="docker.svg" width="32" height="32" alt="Docker"> | `U+E911` | [docker.svg](docker.svg) | Docker |
| <img src="control.svg" width="32" height="32" alt="Controls"> | `U+E912` | [control.svg](control.svg) | 控制 / Controls |
| <img src="statistics.svg" width="32" height="32" alt="Statistics"> | `U+E913` | [statistics.svg](statistics.svg) | 统计 / Statistics |
| <img src="asterisk.svg" width="32" height="32" alt="Asterisk"> | `U+E914` | [asterisk.svg](asterisk.svg) | 星号 / Asterisk |
| <img src="default.svg" width="32" height="32" alt="Package"> | `U+E915` | [default.svg](default.svg) | 默认图标（软件包） / Default (package) |
| <img src="user.svg" width="32" height="32" alt="User"> | `U+E971` | [user.svg](user.svg) | 用户 / User |
| <img src="help.svg" width="32" height="32" alt="Help"> | `U+F059` | [help.svg](help.svg) | 帮助 / Help |
