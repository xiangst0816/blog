---
title: 第九章 客户端检测
author: 烈风裘
date: 2018-02-28T01:59:29.934Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

至少是我这里的前端开发都是自顶向下的模式, 即先按照支持程度最高的浏览器上开发, 之后再适配其他浏览器. 因此, 适配过程就需要对不同的客户端.

## 能力检测

H5 能力检测, 比如这个库: [modernizr](https://modernizr.com/)

## 怪癖检测(Bug 检测)

一般情况下不推荐使用.

## userAgent 检测

一般通过正则匹配 userAgent 进行平台鉴别. 例如:

- [UAParser.js](https://faisalman.github.io/ua-parser-js/) Lightweight JavaScript-based User-Agent String Parser
