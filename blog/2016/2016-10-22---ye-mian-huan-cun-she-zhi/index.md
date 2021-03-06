---
title: 页面缓存设置
author: 烈风裘
date: 2016-10-22T10:08:49.000Z
draft: false
comments: true
star: false
cover: ''
tags:
  - 缓存
---

浏览器缓存机制一般分为两种：HTML Meta 标签控制缓存和 **HTTP 头信息**。

## HTML Meta 标签控制缓存

非 HTTP 协议定义的缓存机制，如使用 HTML Meta 标签，Web 开发者可以在 HTML 页面的<head>节点中加入<meta>标签，代码如下：

```html
＜meta http-equiv="参数" content="参数变量值"＞
```

**参数可以是以下值：**

expires(期限) 、Pragma(cache 模式)、Refresh(刷新) 、
Set-Cookie(cookie 设定) 、Window-target(显示窗口的设定) 、
content-Type(显示字符集的设定) 、Pics-label(网页等级评定) 、
cache-control 等。

[设置请参考这里](http://kinglyhum.iteye.com/blog/827807)

但是，所有缓存代理服务器都不支持上述方法，因为代理不解析 HTML 内容本身。而广泛应用的还是 **HTTP 头信息** 来控制缓存，下面主要介绍 HTTP 协议定义的缓存机制，这个是比较通用的做法。记住相应的参数、作用及设置方法，就差不多了。

## HTTP 头信息控制缓存

### 资源新鲜度检测（Freshness）

`Cache Control`与`Expires`是一组，他们是用来进行 Freshness 验证，也就是提供客户端检测文件是否足够新鲜，可以无需向服务端发起 Validation 请求(见下)就能保证并未过期可以直接使用。

所有的`(from cache)`的请求实际上都是由于浏览器认为本地的缓存资源足够新鲜，所以无需额外请求而直接使用。实际上就是根据本地的时间和服务器返回头的约定信息进行对比验证。

#### Expires

在 HTTP1.0 版本中定义的是`Expires`，`Expires`的值是一个明确的**GMT 格式**的过期时间，指浏览器或缓存服务器在该时间点后必须从真正的服务器中获取新的页面信息；<mark>当用户的时间和服务器时间不一致的手，会引发缓存判断的问题</mark>（例如客户端的本地时间错误）。如果不设置缓存，需要将`Expires`设为 0；

#### Cache Control

因此，在 HTTP1.1 版本中再追加判断字段：`Cache-Control`。**其中`max-age`参数告知客户端这个文件多长时间不会过期**而不是直接告知过期时间。常用的参数如下：

- no-cache：浏览器和缓存服务器都不应该缓存页面信息；
- private：只在内存中缓存, 默认；
- no-store：请求和响应的信息都不应该被存储在对方的磁盘系统中；
- must-revalidate：对于客户机的每次请求，代理服务器必须向服务器验证缓存是否过时；
- public, max-age=[number]：在硬盘中缓存, 浏览器和缓存服务器都可以缓存页面信息，并设定具体的过期秒数

> 以上两个如果同时存在，则`Cache Control`的`max-age`将覆盖`Expires`.

### 资源验证（Validation）

`Last-Modified`和`ETag`则是另一组控制信息，他们用来实现 Validation。他们的职责是在本地缓存被浏览器判断可能不够新鲜的时候，会用这两组信息向服务器请求数据，如果服务器内容没有改变，那么约定服务器会返回 **304(Not Modify)** HTTP Code 表明这个缓存可以直接使用，无需重新拉取，而一旦服务器内容改变了就会返回 **200(from cache)**，同时返回新的文件内容。

#### Last-Modified

在 HTTP 1.0 中约定的`Last-Modified`代表的含义是文件最后一次修改的**GMT 格式**的时间，但是当访问的静态资源师动态生成的，**比如动态 gzip 压缩 js/css 代码，那么返回的`Last-Modified`每次都会不一样**；另外`Last-Modified`只能精确到秒，如果文件变动在秒以内，则客户端无法感知。

如果用户第二次打开，在请求头上会添加`If-Modified-Since`关键字，传递本地缓存的资源最后修改时间`Last-Modified`，之后由服务器判断是返回 304 NotModified 还是 200 OK(新资源)

#### ETag

因此，在 HTTP1.1 版本中再追加判断字段：`ETag`。他的实现不尽相同，对于**动态内容**，常规做法是对动态内容做 HASH 计算，作为 ETAG 返回，对于静态资源，一般是使用 inode+mtime 进行计算。

同样，如果之前设置了此值，当用户第二次打开时，请求头会携带`If-None-Match`关键字，判断资源的`ETag`是否过期。

ETag 也有他自己的问题，所以经常在使用中会关闭`ETag`。举例来说，同一个文件在不同物理机上的 inode 是不同的，这就导致了在分布式的 Web 系统中，当访问落在不同的物理机上时会返回不同的`ETag`，进而导致 304 失效，降级为 200 请求。解决办法也有从`ETag`算法中剥离 inode，只是使用 mtime，但是这样实际上和`Last-Modified`就一样了。当然你也可以额外的做一些改进，使`ETag`对静态资源的算法也是通过 hash 计算的。不过由于一般我们会使用 CDN 技术，因此集群部署中的`ETag`问题并不会造成太大的影响，所以折腾的人也不太是很多。

### Nodejs + Express 处理方式

#### 静态资源处理

- 设置 30 天后过期

```js
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: false, //资源标记
    maxAge: 0, //除去下面格式的其余文件不缓存，比如html
    setHeaders: function(res, path, state) {
      if (/\.(js|css|png|gif|jpg|jpeg)$/.test(path)) {
        // 未来的一个过期时间
        res.set("Expires", new Date(Date.now() + 2592000 * 1000).toGMTString());
        res.set("Cache-Control", "public, max-age=2592000");
      }
    }
  })
);
```

- 不缓存

```js
app.use(express.static(path.join(__dirname, 'public'), {
    etag: false, //资源标记
    maxAge: 0，
    setHeaders: function (res, path, state) {
        if(/\.(js|css|png|gif|jpg|jpeg)$/.test(path)){
            res.set('Expires', 0),
            res.set('Cache-Control', 'no-cache')
        }
    }
}));
```

### 缓存策略根据不同的重新浏览方式分为以下几种情况

- 打开新窗口

  如果指定 cache-control 的值为 private、no-cache、must-revalidate，那么打开新窗口访问时都会重新访问服务器。而如果指定了 max-age 值，那么在此值内的时间里就不会重新访问服务器，例如：

  Cache-control: max-age=5
  表示当访问此网页后的 5 秒内再次访问不会去服务器获取资源

- 在地址栏回车

  如果值为 private 或 must-revalidate（和网上说的不一样），则只有第一次访问时会访问服务器，以后就不再访问。如果值为 no-cache，那么每次都会访问。如果值为 max-age，则在过期之前不会重复访问。

- 按后退按扭

  如果值为 private、must-revalidate、max-age，则不会重新访问，而如果为 no-cache，则每次都重复访问

- 按刷新按扭

  无论为何值，都会重复访问

### 总结一下

`ETag`的设置并不会影响 Freshness 验证，Freshness 验证只会和浏览器策略、`Cache Control`、`Expires`有关。

也就是说，如果访问的静态资源并不会存在小于 1s 的求改情况，`ETag`可以关闭。

下面是上述文字的整个流程图：

![流程图](1476065346000.png)

**说明点:**

- 当 freshness 检查失败，则发送资源请求并携带 ETage 和 Last-Modified 信息
- ETag 和 Last-Modified 都会发送给服务器不分前后
- Etag 用于动态内容会比 Last-Modified 好

### 参考文章

- [页面的缓存与不缓存设置](http://www.cnblogs.com/liuling/archive/2013/07/25/2013-7-25-01.html)
- [配置错误产生的差距：200 OK (FROM CACHE) 与 304 NOT MODIFIED](http://div.io/topic/854#4091)
- ["Cache-control"常见的取值](http://www.cnblogs.com/cuixiping/archive/2008/05/04/1181056.html)
- [Meta http-equiv 属性详解](http://kinglyhum.iteye.com/blog/827807)
- [浏览器 HTTP 协议缓存机制详解](https://my.oschina.net/leejun2005/blog/369148)
