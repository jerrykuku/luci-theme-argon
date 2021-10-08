# luci-app-go-aliyundrive-webdav
<div align="center">
<a href="/LICENSE.txt">
    <img src="https://img.shields.io/github/license/jerrykuku/luci-app-go-aliyundrive-webdav?style=flat-square" alt="">
  </a><a href="https://github.com/jerrykuku/luci-app-go-aliyundrive-webdav/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="">
  </a><a href="hhttps://github.com/jerrykuku/luci-app-go-aliyundrive-webdav/issues/new">
    <img src="https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square">
  </a><a href="https://github.com/jerrykuku/luci-app-go-aliyundrive-webdav/releases">
    <img src="https://img.shields.io/badge/release-v1.0.1-blue.svg?style=flat-square">
  </a><a href="hhttps://github.com/jerrykuku/luci-app-go-aliyundrive-webdav/releases">
    <img src="https://img.shields.io/github/downloads/jerrykuku/luci-app-go-aliyundrive-webdav/total?style=flat-square">
  </a><a href="https://t.me/jerryk6">
    <img src="https://img.shields.io/badge/Contact-telegram-blue?style=flat-square">
  </a>  
</div>

# 介绍
本项目是go-aliyun-webdav 的Luci 控制面板。  
[项目链接](https://github.com/LinkLeong/go-aliyun-webdav)

### 如何编译
假设你的Lean openwrt（最新版本19.07） 在 lede 目录下
```
cd lede/package/lean/  

git clone https://github.com/jerrykuku/go-aliyundrive-webdav.git #主程序

git clone https://github.com/jerrykuku/luci-app-go-aliyundrive-webdav.git  

make menuconfig

#选择 LUci->Application->luci-app-go-aliyundrive-webdav

make -j$(($(nproc) + 1)) V=s #随固件编译

make package/lean/luci-app-go-aliyundrive-webdav/compile V=s #单独编译插件
```

# 客户端兼容性
| 客户端 | 下载 | 上传 | 备注 |
| :-----| ----: | :----: | :----: |
| Rclone | 可用 | 可用 | 推荐，支持各个系统 |
| Mac原生 | 可用 | 可用 | 适配有问题，不建议使用 | 
| Windows原生 | 可用 | 有点小问题 | 不建议，适配有点问题，上传报错 |
| RaiDrive | 可用 | 可用 | Windows平台下建议用这个 |


# 浏览器获取refreshToken方式
1. 先通过浏览器（建议chrome）打开阿里云盘官网并登录：https://www.aliyundrive.com/drive/
2. 登录成功后，按F12打开开发者工具，点击Application，点击Local Storage，点击 Local Storage下的 [https://www.aliyundrive.com/](https://www.aliyundrive.com/)，点击右边的token，此时可以看到里面的数据，其中就有refresh_token，把其值复制出来即可。（格式为小写字母和数字，不要复制双引号。例子：ca6bf2175d73as2188efg81f87e55f11）
3. 第二步有点繁琐，大家结合下面的截图就看懂了
 ![image](https://user-images.githubusercontent.com/32785355/119246278-e6760880-bbb2-11eb-877c-aca16cf75d89.png)

# 功能说明
## 支持的功能
1. 查看文件夹、查看文件
2. 文件移动目录
3. 文件重命名
4. 文件下载
5. 文件删除
6. 文件上传
7. 支持WebDav权限校验（默认账户密码：admin/123456）
8. 文件在线编辑
9.  Webdav下的流媒体播放等功能
## 已知问题
1. 没有做文件sha1校验，不保证上传文件的100%准确性（一般场景下，是没问题的）
2. 通过文件名和文件大小判断是否重复。也就是说如果一个文件即使发生了更新，但其大小没有任何改变，是不会自动上传的
3. 不支持文件名包含 `/` 字符 
4. 部分客户端兼容性不好 


# 免责声明
1. 本软件为免费开源项目，无任何形式的盈利行为。
2. 本软件服务于阿里云盘，旨在让阿里云盘功能更强大。如有侵权，请与我联系，会及时处理。
3. 本软件皆调用官方接口实现，无任何“Hack”行为，无破坏官方接口行为。
5. 本软件仅做流量转发，不拦截、存储、篡改任何用户数据。
6. 严禁使用本软件进行盈利、损坏官方、散落任何违法信息等行为。
7. 本软件不作任何稳定性的承诺，如因使用本软件导致的文件丢失、文件破坏等意外情况，均与本软件无关。
