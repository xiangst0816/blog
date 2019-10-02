---
title: cnpm使用总结
author: 烈风裘
date: 2019-09-22T07:24:45.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - 未归档
---

# cnpm使用总结

## 安装

全局安装，[详情](https://npm.taobao.org)：

```
$ npm install tnpm -g --registry=https://registry.npm.taobao.org
```



## 使用问题

cnpm是使用软连方式安装，所以在IDE使用时，会遇到两个问题：

1. 某些 IDE 无法正确识别软链，会导致循环索引。
2. `node_modules` 目录下同时存在软链，不方便查看。

第一点，安装 [webstorm-disable-index](https://www.npmjs.com/package/webstorm-disable-index) 这个依赖包即可。

```
$ tnpm i webstorm-disable-index --save-dev
$ ls .idea/
```

第二点，你可以在 `VSCode` 配置：

```
"files.exclude": {
  "**/node_modules/_*@*": true,
},
```

在 `WebStorm` 配置 `File Types` 的 `Ignore` 增加 `_*@*;` 即可。

![](webstorm_ignore.49004433.png)









