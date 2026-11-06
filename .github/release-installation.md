## 修复

- 修复部分固件升级后 Argon 翻译丢失，保留已有翻译，并在后续在线升级时同步语言包（#737）。
- 修复部分固件因下载器缺少 HTTPS 支持而无法获取在线壁纸的问题（#738）。
- 修复网桥 VLAN 下拉菜单文字逐字竖排的问题（#738）。

## Fixed

- Preserve bundled Argon translations during upgrades and synchronize language packages in subsequent online updates (#737).
- Fix online wallpapers failing on firmware that selects a downloader without HTTPS support (#738).
- Keep bridge VLAN dropdown labels readable instead of wrapping one character per line (#738).

v3.1.0 及以上可在线升级。安装说明：[中文](https://github.com/jerrykuku/luci-theme-argon/blob/v3.1.3/README_ZH.md#安装) · [English](https://github.com/jerrykuku/luci-theme-argon/blob/v3.1.3/README.md#install)
