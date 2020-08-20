# luci-theme-argon ([Eng](/README.md))
[1]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[2]: /LICENSE
[3]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[4]: https://github.com/jerrykuku/luci-theme-argon/pulls
[5]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg
[6]: https://github.com/jerrykuku/luci-theme-argon/issues/new
[7]: https://img.shields.io/badge/release-v1.6.8-blue.svg?
[8]: https://github.com/jerrykuku/luci-theme-argon/releases
[9]: https://img.shields.io/github/downloads/jerrykuku/luci-theme-argon/total
[10]: https://img.shields.io/badge/Contact-telegram-blue
[11]: https://t.me/jerryk6
[![license][1]][2]
[![PRs Welcome][3]][4]
[![Issue Welcome][5]][6]
[![Release Version][7]][8]
[![Release Count][9]][8]
[![Contact Me][10]][11]


![](/Screenshots/screenshot_pc.jpg)
![](/Screenshots/screenshot_phone.jpg)


全新的 Openwrt 主题，基于luci-theme-material 和 开源免费的 Argon 模板进行移植。 

## 注意
当前master版本基于官方 OpenWrt 19.07.1 稳定版固件进行移植适配。  
v2.2.3 适配官方主线快照版本。  
v1.6.8 适配18.06 和 Lean Openwrt [如果你是lean代码 请选择这个版本]


## 如何使用
进入 openwrt/package/lean  或者其他目录

####Lean lede
```
cd lede/package/lean  
rm -rf luci-theme-argon  
git clone -b 18.06 https://github.com/jerrykuku/luci-theme-argon.git  
make menuconfig #choose LUCI->Theme->Luci-theme-argon  
make -j1 V=s  
```

####Openwrt SnapShots
```
cd openwrt/package
git clone https://github.com/jerrykuku/luci-theme-argon.git  
make menuconfig #choose LUCI->Theme->Luci-theme-argon  
make -j1 V=s  
```

## 安装 

### For Lean openwrt 18.06 LuCI
```
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v1.6.8/luci-theme-argon_1.6.8-20200820_all.ipk
opkg install luci-theme-argon*.ipk
```


## Update log 2020.08.20 [18.06] V1.6.8 

- 去掉了对wget的依赖，默认是用luasocket,为避免更新出错，请提前opkg install luasocket【v1.6.8】
- 更新了图标库，为未定义的菜单增加了一个默认的图标。【v1.6.8】

- 背景文件策略调整为，同时接受 jpg png gif mp4, 图片和视频同时随机。【v1.6.6】
- 视频背景加了一个音量开关，喜欢带声音的可以自行点击开启，默认为静音模式【v1.6.6】
- 修复了手机模式下，登录页面出现键盘时，文字覆盖按钮的问题【v1.6.6】
- 修正了暗黑模式下下拉选项的背景颜色，同时修改了滚动条的样式【v1.6.6】
- jquery 更新到 v3.5.1【v1.6.6】

- 增加可自定义登录背景功能，请自行将文件上传到/www/luci-static/argon/background 目录下，支持jpg png gif格式图片，主题将会优先显示自定义背景，多个背景为随机显示，系统默认依然为从bing获取【v1.6.4】
- 增加了可以强制锁定暗色模式的功能，如果需要，请登录ssh 输入：touch /etc/dark 即可开启，关闭请输入：rm -rf /etc/dark，关闭后颜色模式为跟随系统【v1.6.4】
- 修改了底部argon版本的获取方式，以后将自动根据ipk版本显示【v1.6.4】
- 修正了一些文字的颜色【v1.6.4】

- 登录背景添加毛玻璃效果 【v1.6.3】

- 全新的登录界面,图片背景跟随Bing.com，每天自动切换 【v1.6.1】
- 全新的主题icon 
- 增加多个导航icon 
- 细致的微调了 字号大小边距等等 
- 重构了css文件 
- 自动适应的暗黑模式



## 截图
![](/Screenshots/pc/screenshot1.jpg)
![](/Screenshots/pc/screenshot2.jpg)
![](/Screenshots/pc/screenshot3.jpg)
![](/Screenshots/phone/Screenshot_1.jpg)
![](/Screenshots/phone/Screenshot_2.jpg)

## 感谢
luci-theme-material: https://github.com/LuttyYang/luci-theme-material/
