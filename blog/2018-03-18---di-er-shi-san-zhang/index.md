---
title: 第二十三章 离线应用与客户端存储
author: 烈风裘
date: 2018-03-18T09:21:20.680Z
draft: false
comments: false
star: false
cover: ''
tags: 
  - 未归档
---


### 1. 如何判断在线状态?

**属性:**

```js
navigator.onLine
```

**事件:**

```js
EventUtil.addHandler(window, "online", function(){ 
	alert("Online"); 
}); 
EventUtil.addHandler(window, "offline", function(){
	alert("Offline"); 
});
```

### 2. manifest应用缓存

看下Gatsby的实现. 书上说的和Gatsby实现的方式不一样.

- gatsby-plugin-offline
- gatsby-plugin-manifest

### 3. Cookie相关

**作用:**

在客户端用于存储会话信息的

**限制:**

- 一个域下的所有cookie长度限制在4095B(含)以内
- 每个域名下cookie个数不超过50个(一般最大)
- 每次请求会携带cookie, 不建议存储大信息量
- cookie不会区分大小写, 内部"名称", "值"都是经过URL编码的

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

`document.cookie` 返回当前页面可用的（根据 cookie 的域、路径、失效时间和安全设置）所有 cookie 的字符串，一系列由分号隔开的名值对儿.

**设置格式:**

name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure

**HTTP专有cookie(HTTP only)**

可以从浏览器或者服务器设置，但**是只能从服务器端读取**，因为 JavaScript 无法获取 HTTP 专有 cookie 的值。

HTTPOnly 是一个方式XSS的手段, 是不再允许出现js操作cookie的场景了，但是自己也没法儿使用js操作cookie了. 会造成使用上和迁移上的麻烦.


**javaEE服务端这样设置:**

```java
response.setHeader("Set-Cookie", "cookiename=value; 
Path=/;Domain=domainvalue;Max-Age=seconds;HTTPOnly");
```
### 4. sessionStorage, localStorage

- storage事件, 用于跨tab通信
- 5MB存储限制

### 5. 如果cookie中未设置过期时间会如何?

服务器设置的cookie只在当期会话有效, 关闭浏览器后删除对应cookie.

### 6. JS本地操作cookie的处理流程有哪些?

一般分为: `get()` / `set()` / `remove()`


**`get(name)`**

> **注意`name`需要`encodeURIComponent`处理, 返回的值需要`decodeURIComponent`**


- 找到`name`的startIndex
- 从index开始找结尾标志`;`的endIndex, 如果未找到则到了cookie末端, endIndex为cookie字符串长度
- 根据起止位置用 `substring(startIndex+name.length, endIndex)` 截取字符串返回


**`set(name, value, expires, path, domain, secure)`**

> 设置cookie可以不用管原先已存储的值, 如果浏览器中cookie已存在则覆盖, 不存在则新增, 我们只需要传递修改的字符串即可


- 将`name`和`value`进行`encodeURIComponent`, 根据传入的配置拼接字符串
- 将值转给`document.cookie`

**`remove(key, options)`**

> cookie不可以删除, 需要使用相同的路径、域和安全选项再次设置 cookie，并将失效时间设置为过去的时间。

等效代码: 

```js
this.set(name, "", new Date(0), path, domain, secure);
```
