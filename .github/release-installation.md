## 更新内容

- 后台页面可使用图片或视频壁纸，并可单独切换毛玻璃效果。默认保留原有后台外观。
- 登录页只加载所需样式，在线壁纸在后台刷新。图片源不可用时，自动回到上传的本地图片或视频。
- 改善小屏无线详情、侧栏键盘导航、强制颜色模式和自定义主题色的文字对比度。升级后浏览器会获取新版主题脚本和样式。
- Unsplash 与 Wallhaven 分别保存密钥。原先使用 Unsplash 的配置会自动迁移。归属不明的旧密钥保留在本地 `legacy_wallpaper_api_key`，Wallhaven 标签源使用 `wallhaven_api_key`。

## What changed

- Use image or video wallpapers on admin pages and toggle the glass effect independently. Existing admin layouts keep their default appearance.
- Load only the styles needed for sign-in and refresh online wallpapers in the background. Failed image requests fall back to an uploaded image or video.
- Improve narrow-screen wireless details, keyboard navigation, forced colors and text contrast with custom theme colors. Browsers refresh Argon scripts and styles after upgrades.
- Store Unsplash and Wallhaven keys separately. Existing Unsplash configurations migrate automatically. Unassigned keys stay local in `legacy_wallpaper_api_key`. Tagged Wallhaven sources use `wallhaven_api_key`.

从 v3.1.0 及以上版本，可在 **系统 → Argon 主题设置 → 主题更新** 中检查并安装本版。

From v3.1.0 or later, open **System → Argon Config → Theme updates** to check for and install this release.

[中文安装说明](https://github.com/jerrykuku/luci-theme-argon/blob/v3.2.0/README_ZH.md#安装) · [English installation guide](https://github.com/jerrykuku/luci-theme-argon/blob/v3.2.0/README.md#install)
