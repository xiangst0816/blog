---
title: 从输入URL到页面显示过程中发生的事儿
author: 烈风裘
date: 2018-03-22T08:23:57.825Z
draft: false
comments: true
star: true
cover: ''
tags:
  - 随笔
---

> 占坑，内容会陆续补齐

### 1. URL->IP

将输入的域名转化为真实的 IP 地址，这里涉及到 DNS 层层向外查找等内容。

### 2. IP->HTTP

拿到远端的 IP 地址，浏览器向服务器发送 HTTP 请求，包括相应的请求头

### 3. HTTP->TCP

### 4. 服务端部分

#### 4.1 负载均衡

### 5. 浏览器接收数据

### 6. 浏览器解析 HTML 流程

浏览器渲染过程，资源加载同步异步

### 7. 浏览器资源加载过程

keep-alive、缓存、HTTP1.0、HTTP1.1、HTTPS、HTTP2.0

### 8. 浏览器渲染过程

### 9. 渲染过程各个阶段及事件

### 10. JavaScript 执行时机及流程

JS 加载阻塞 HTML 解析，建议在 DOMContentLoaded 事件后操作 DOM。

### 11. 异步请求过程及跨域

XMLHTTPRequest、XDomainRequest、cookie 等

### 12. 异步数据更新页面过程

Layout->Paint->Composite
