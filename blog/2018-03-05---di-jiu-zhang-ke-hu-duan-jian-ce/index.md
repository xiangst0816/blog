---
title: 第九章 客户端检测
author:
date: 2018-03-05T01:08:59.000Z
draft: false
comments: false
star: false
cover: ''
tags: 
  - 未归档
---

# 第九章 客户端检测

至少是我这里的前端开发都是自顶向下的模式, 即先按照支持程度最高的浏览器上开发, 之后再适配其他浏览器. 因此, 适配过程就需要对不同的客户端.

## 能力检测

H5能力检测: https://modernizr.com/

## 怪癖检测(Bug检测)


### userAgent检测

一般通过正则匹配userAgent进行平台鉴别.

