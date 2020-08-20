# luci-theme-argon ([中文](/README_ZH.md))

[1]: https://img.shields.io/badge/license-MIT-brightgreen.svg
[2]: /LICENSE
[3]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[4]: https://github.com/jerrykuku/luci-theme-argon/pulls
[5]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg
[6]: https://github.com/jerrykuku/luci-theme-argon/issues/new
[7]: https://img.shields.io/badge/release-v2.2.2-blue.svg?
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

![](/Screenshots/pc/light1.jpg)
![](/Screenshots/pc/dark1.jpg)
![](/Screenshots/phone/light1.jpg)
![](/Screenshots/phone/dark1.jpg)

A new Luci theme for LEDE/OpenWRT  
Argon is a clean HTML5 theme for LuCI. It is based on luci-theme-material and Argon Template  

## Notice 
v2.2 Adapt to official mainline snapshot.  
You can checkout branch 18.06 for  OpenWRT 18.06 or lean 19.07.

## How to build

Enter in your openwrt/package/lean  or  other
####Lean lede
```
cd lede/package/lean  
rm -rf luci-theme-argon  
git clone -b 18.06 https://github.com/jerrykuku/luci-theme-argon.git  
make menuconfig #choose LUCI->Theme->Luci-theme-argon  
make -j1 V=s  
```

####Openwrt official SnapShots
```
cd openwrt/package
git clone https://github.com/jerrykuku/luci-theme-argon.git  
make menuconfig #choose LUCI->Theme->Luci-theme-argon  
make -j1 V=s  
```

## Install 
### For Lean openwrt 18.06 LuCI
```
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v1.6.6/luci-theme-argon_1.6.6-20200815_all.ipk
opkg install luci-theme-argon*.ipk
```

### For openwrt official 19.07 Snapshots LuCI master 
```
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.2.3/luci-theme-argon_2.2.3-20200820_all.ipk
opkg install luci-theme-argon*.ipk
```

## Update log 2020.08.20 v2.2.3 
- Fix Firmware flash page display error in dark mode【v2.2.3】
- Update font icon, add a default icon of undefined menu【v2.2.3】

- Add custom login background,put your image (allow png jpg gif) or MP4 video into /www/luci-static/argon/background, random change【v2.2.2】
- Add force dark mode, login ssh and type "touch /etc/dark" to open dark mode.【v2.2.2】
- Add a volume mute button for video background, default is muted.【v2.2.2】
- fix login page when keyboard show the bottom text overlay the button on mobile.【v2.2.2】
- fix select color in dark mode,and add a style for scrollbar.【v2.2.2】
- jquery update to v3.5.1【v2.2.2】
- change request bing api method form wget to luasocket (DEPENDS)【v2.2.2】

- Add blur effect for login form 【v2.2.1】
- New login theme, Request background imge from bing.com, Auto change everyday. 
- New theme icon 
- Add more menu category  icon 
- Fix font-size and padding margin 
- Restructure css file 
- Auto adapt to dark mode

## More Screenshots

![](/Screenshots/pc/light2.jpg)
![](/Screenshots/pc/light3.jpg)
![](/Screenshots/pc/dark2.jpg)
![](/Screenshots/pc/dark3.jpg)
![](/Screenshots/phone/light2.jpg)
![](/Screenshots/phone/light3.jpg)
![](/Screenshots/phone/dark2.jpg)
![](/Screenshots/phone/dark3.jpg)

## Thanks to 
luci-theme-material: https://github.com/LuttyYang/luci-theme-material/
