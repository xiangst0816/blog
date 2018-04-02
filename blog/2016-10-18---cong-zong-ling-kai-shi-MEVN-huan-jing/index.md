---
title: 从零开始MEVN环境部署
author: 烈风裘
date: 2016-10-18T13:12:32.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - MEVN
---

> 前言介绍，因为在给网站升级 https，其中涉及到修改文件内容等操作，于是阴差阳错的将/etc 文件全部`chmod 777`了，结果导致阿里云服务器远程 SSH 无法登录及 FTP 也无法使用。
>
> 更悲催的是，我之前都没做过数据库镜像备份及数据库备份，想着应该不会发生，结果还是发生了。从客服了解到，只能重置服务器，让我将‘受伤’的系统盘做一个镜像。等新系统初始化完毕之后挂载镜像再做修复。
>
> 于是，就有了这边文章的起源。从零开始部署+修复数据。不过，没想象的难。

## MEVN

这个单词是 Mongodb、Express、Vue、Nodejs 全栈技术的缩写，和 MEAN 很像，其中 Vue 也是 MVVM 框架，因此改动不算大。

## 阿里云服务器

购买了阿里云的包年的服务器，选择 CentOS+Nginx+Nodejs 的环境配置之后拿到手的就是原始的服务器环境。

## SSH 登录

Mac 使用起来还是挺方便的，在终端中输入命令及密码：

```
$ ssh -p 22 root@xxx.xxx.xxx.xxx
$ password
```

## Nodejs 升级

升级 Nodejs 是为了使用 ES6 的语法写后台应用，首次尝试了使用 YUM 安装：

```
$ yum insalll -y nodejs
```

这个命令安装的是 0.10 版本，但是现在 Node 最新版本已经是 6.8.1 了，故需要换一个方法。先下载最新版本，之后再安装。[参考这里](http://jingyan.baidu.com/article/dca1fa6f48f478f1a5405272.html)。

```
$ curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
$ yum install -y nodejs
```

之后是安装 npm 包管理器、n 命令（nodejs 版本管理工具）、cnpm、pm2

```
$  yun install -y npm
$ npm install n -g
$ npm install cnpm -g
$ cnpm install pm2 -g
```

## 挂载原来的镜像文件

邀请了阿里云的客服帮我把以前的服务器镜像挂载到了`/dev/vdb1`下，通过下面的的命令打开镜像，很是很简单。镜像在`/alidata/disk_bk`下显示。之后就可以 cd 进去了。

```
$ mount -o loop /dev/vdb1 /alidata/disk_bk
```

解挂命令(当前在/alidata 下)：

```
$ umount disk_bk/

$ lsof | grpe disk_bk //如果解挂不行，查询当前那个进程在使用，然后
$ kill -9 pid
```

使用`mv`命令将以前的资料导出到新环境中，包括部署前端文件及数据库。

## Nginx

我只是修改了转发端口，之前是代理 8088，我改成了我的 8080.

配置文件：

```
/alidata/server/nginx/conf/vhosts
```

进入目录后重启服务：

```
$ cd /alidata/server/nginx/sbin
$ ./nginx -s reload
```

## Mongodb

### 关闭以前的 mongod 服务

```
$ mongod --shutdown //不行使用下面的

$  lsof | grep 27017  //找占用27017端口的进程，然后kill，一般都这么搞
$  kill pid
```

### 启动 mongod 服务，指向最新数据库

#### mongod 以守护进程的方式启动

```
mongod --dbpath=/data/db --port=27017 --fork --logpath=/alidata/log/mongod/mongod.log
```

#### 查看日志是否错误

```
tail -f /var/log/mongd.log //查看日志文件（cat也行）
```

## 启动应用

安装各种依赖

```
$ cnpn install
```

然后就能启动了，然后查看输出是否有问题。

```
$ cd /home/x-songtao
$ pm2 start ./bin/www -n x-songtao -i max;pm2 logs
```

最后，[访问试试看](xiangsongtao.com)，噢耶！

(完)
