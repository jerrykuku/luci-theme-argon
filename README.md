# luci-theme-argon ([中文](/README_ZH.md))
A new Luci theme for LEDE/OpenWRT  
Argon is a clean HTML5 theme for LuCI. It is based on luci-theme-material and Argon Template  


The old version is still in another branch call old. If you need that you can checkout that branch.

## Notice
v2.01 Adapt to official 19.07 stable version (not snapshot) LuCI openwrt-19.07 branch (git-20.006.26738-35aa527).  
v2.1 Adapt to official mainline snapshot.  
You can checkout branch 18.06 for  OpenWRT 18.06 or lean 19.07.

## How to use

Enter in your openwrt/package/lean  or  other

```
git clone https://github.com/jerrykuku/luci-theme-argon.git
make menuconfig #choose LUCI->Theme->Luci-theme-argon
make -j1 V=s
```
## Install 
### For Lean openwrt
```
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v1.3/luci-theme-argon_1.3-01-20191111_all.ipk
opkg install luci-theme-argon_1.3-01-20191111_all.ipk
```

### For openwrt 19.07 stable LuCI branch (git-20.006.26738-35aa527)
```
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.01/luci-theme-argon_2.01-20200203_all.ipk
opkg install luci-theme-argon_2.01-20200203_all.ipk
```

### For openwrt 19.07 Snapshots LuCI master (git-20.033.77428-3d63732)
```
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.1/luci-theme-argon_2.1-20200206_all.ipk
opkg install luci-theme-argon_2.1-20200206_all.ipk
```

## Update log 2020.02.06
1. v2.01  Fix display error, when not set password.
2. v2.1 Adapt to official mainline snapshot.

## Screenshots
![](/Screenshots/pc1.jpg)
![](/Screenshots/pc2.jpg)
![](/Screenshots/pc3.jpg)
![](/Screenshots/phone.jpg)

## Thanks to 
luci-theme-material: https://github.com/LuttyYang/luci-theme-material/
