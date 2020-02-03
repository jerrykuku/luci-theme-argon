# luci-theme-argon ([Eng](/README.md))
全新的 Openwrt 主题，基于luci-theme-material 和 开源免费的 Argon 模板进行移植。 

## 注意
当前master版本基于官方 OpenWrt 19.07.1 稳定版固件进行移植适配。
集成前请确认当前的luci 版本是比较新的版本，如果不是新版的LUCI 建议拉取18.06分支。


## 如何使用
进入 openwrt/package/lean  或者其他目录

```
git clone https://github.com/jerrykuku/luci-theme-argon.git

make menuconfig #choose LUCI->Theme->Luci-theme-argon

make -j1 V=s
```
## 安装
```
opkg install https://github.com/jerrykuku/luci-theme-argon/releases/download/V1.3/luci-theme-argon_1.3-01-20191111_all.ipk
```

## 更新日志 20200203
1. 修复了一些首页不能显示的问题。


## 截图
![](/Screenshots/pc1.jpg)
![](/Screenshots/pc2.jpg)
![](/Screenshots/pc3.jpg)
![](/Screenshots/phone.jpg)

## 感谢
luci-theme-material: https://github.com/LuttyYang/luci-theme-material/
