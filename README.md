# luci-theme-argon
A new Luci theme for LEDE/OpenWRT  
Argon is a clean HTML5 theme for LuCI. It is based on luci-theme-material and Argon Template  


The old version is still in another branch call old. If you need that you can checkout that branch.

## Notice
The Current Branch Support 19.07, But it is only for test.
You can checkout branch 18.06 for  OpenWRT 18.06

## How to use

Enter in your openwrt/package/lean  or  other

```
git clone https://github.com/jerrykuku/luci-theme-argon.git
make menuconfig #choose LUCI->Theme->Luci-theme-argon
make -j1 V=s
```
## Install
```
opkg install https://github.com/jerrykuku/luci-theme-argon/releases/download/V1.3/luci-theme-argon_1.3-01-20191111_all.ipk
```

## Update log 20200131
1. New Code For OpenWRT 19.07 for test.

## Screenshots
![](/Screenshots/pc1.jpg)
![](/Screenshots/pc2.jpg)
![](/Screenshots/pc3.jpg)
![](/Screenshots/phone.jpg)

## Thanks to 
luci-theme-material: https://github.com/LuttyYang/luci-theme-material/
