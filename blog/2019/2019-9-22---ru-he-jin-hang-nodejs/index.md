---
title: 如何进行Nodejs版本管理
author: 烈风裘
date: 2019-09-22T07:14:15.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - 未归档
---

# 如何进行Nodejs版本管理

##  使用场景

一般来说，直接从 [Node.js 官网](https://nodejs.org/)下载对应的安装包，即可完成环境配置。

但在**本地开发**的时候，经常需要快速更新或切换版本。

社区有 [nvm](https://github.com/creationix/nvm)、[n](https://github.com/tj/n) 等方案，我们推荐跨平台的 [nvs](https://github.com/jasongin/nvs)。

## 如何安装

###  Linux / macOS 环境

通过 Git Clone 对应的项目即可。

```
$ export NVS_HOME="$HOME/.nvs"
$ git clone https://github.com/jasongin/nvs --depth=1 "$NVS_HOME"
$ . "$NVS_HOME/nvs.sh" install
```

> 注意，安装程序会在`~/.bashrc`, `~/.profile`, 或者 `~/.zshrc` 中写入命令，先保证这些文件是存在的！

### Windows 环境

由于 Windows 环境配置比较复杂，所以 Windows 环境下还是推荐使用 `msi` 文件完成初始化工作。

访问 [nvs/releases](https://github.com/jasongin/nvs/releases) 下载最新版本的 `nvs.msi`，然后双击安装即可。

## 配置镜像地址

在国内由于大家都懂的原因，需要把对应的镜像地址修改下：

```
$ nvs remote node https://npm.taobao.org/mirrors/node/
$ nvs remote
default             node
chakracore          https://github.com/nodejs/node-chakracore/releases/
chakracore-nightly  https://nodejs.org/download/chakracore-nightly/
nightly             https://nodejs.org/download/nightly/
node                https://nodejs.org/dist/
```

## 使用指南

通过以下命令，即可非常简单的安装 Node.js 最新的 LTS 版本。

```
# 安装最新的 LTS 版本
$ nvs add lts

# 配置为默认版本
$ nvs link lts
```

安装其他版本：

```
# 安装其他版本
$ nvs add 8

# 查看已安装的版本
$ nvs ls

# 在当前 Shell 切换版本
$ nvs use 8
```

更多指令参见 `nvs --help` 。

## 共用 npm 全局模块（必须）

使用 `nvs` 时，默认的 `prefix` 是当前激活的 Node.js 版本的安装路径。

带来一个问题是：切换版本之后，之前安装全局命令模块需要重新安装，非常不方便。

解决方案是配置统一的全局模块安装路径到 `~/.npm-global`，如下：

```
$ mkdir -p ~/.npm-global
$ npm config set prefix ~/.npm-global
```

还需配置环境变量到 `~/.bashrc` 或 `~/.zshrc` 文件里面：

> 缺少了这步，全局安装的命令都不会生效！

```
$ echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.zshrc
$ source ~/.zshrc
```