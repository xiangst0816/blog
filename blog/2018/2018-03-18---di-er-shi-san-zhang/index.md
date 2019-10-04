---
title: 第二十三章 离线应用与客户端存储
author: 烈风裘
date: 2018-03-18T09:21:20.680Z
draft: false
comments: true
star: false
cover: ''
tags:
  - JS高程
---

### 1. 如何判断在线状态?

**属性:**

```js
navigator.onLine;
```

**事件:**

```js
EventUtil.addHandler(window, "online", function() {
  alert("Online");
});
EventUtil.addHandler(window, "offline", function() {
  alert("Offline");
});
```

### 2. manifest 应用缓存

看下 Gatsby 的实现. 书上说的和 Gatsby 实现的方式不一样.

- gatsby-plugin-offline
- gatsby-plugin-manifest

### 3. Cookie 相关

**作用:**

在客户端用于存储会话信息的

**限制:**

- 一个域下的所有 cookie 长度限制在 4095B(含)以内
- 每个域名下 cookie 个数不超过 50 个(一般最大)
- 每次请求会携带 cookie, 不建议存储大信息量
- cookie 不会区分大小写, 内部"名称", "值"都是经过 URL 编码的

**组成:**

名称, 值, 域, 路径, 失效时间, 安全标志

```
name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com
name=value; domain=.wrox.com; path=/; secure

// 格式
name=value; expires=expiration_time; path=domain_path;
domain=domain_name; secure;
```

**注意:**

- 域、路径、失效时间和 secure 标志**都是服务器给浏览器的指示**，以指定何时应该发送 cookie。
- 这些参数并不会作为发送到服务器的 cookie 信息的一部分，**只有名值对儿才会被发送**。

**获取:**

`document.cookie` 返回当前页面**可用的**（根据 cookie 的域、路径、失效时间和安全设置）所有 cookie 的字符串，一系列由分号隔开的名值对儿.

**设置格式:**

name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure

**HTTP 专有 cookie(HTTP only)**

可以从浏览器或者服务器设置，但**是只能从服务器端读取**，因为 JavaScript 无法获取 HTTP 专有 cookie 的值。

HTTPOnly 是一个方式 XSS 的手段, 是不再允许出现 js 操作 cookie 的场景了，但是自己也没法儿使用 js 操作 cookie 了. 会造成使用上和迁移上的麻烦.

**javaEE 服务端这样设置:**

```java
response.setHeader("Set-Cookie", "cookiename=value;
Path=/;Domain=domainvalue;Max-Age=seconds;HTTPOnly");
```

### 4. sessionStorage, localStorage

- storage 事件, 用于跨 tab 通信
- 5MB 存储限制

### 5. 如果 cookie 中未设置过期时间会如何?

服务器设置的 cookie 只在当期会话有效, 关闭浏览器后删除对应 cookie.

### 6. JS 本地操作 cookie 的处理流程有哪些?

一般分为: `get()` / `set()` / `remove()`

**`get(name)`**

> **注意`name`需要`encodeURIComponent`处理, 返回的值需要`decodeURIComponent`**

- 找到`name`的 startIndex
- 从 index 开始找结尾标志`;`的 endIndex, 如果未找到则到了 cookie 末端, endIndex 为 cookie 字符串长度
- 根据起止位置用 `substring(startIndex+name.length, endIndex)` 截取字符串返回

**`set(name, value, expires, path, domain, secure)`**

> 设置 cookie 可以不用管原先已存储的值, 如果浏览器中 cookie 已存在则覆盖, 不存在则新增, 我们只需要传递修改的字符串即可

- 将`name`和`value`进行`encodeURIComponent`, 根据传入的配置拼接字符串
- 将值转给`document.cookie`

**`remove(key, options)`**

> cookie 不可以删除, 需要使用相同的路径、域和安全选项再次设置 cookie，并将失效时间设置为过去的时间。

等效代码:

```js
this.set(name, "", new Date(0), path, domain, secure);
```

### 7. sessionStorage 和 localStorage 使用的差别？

- sessionStorage 中的数据在**当前会话期**存在，而 localStorage 则一直存在
- **localStorage 中新增数据可以在其他 Tab 中同步**，但是 sessionStorage 不会同步
