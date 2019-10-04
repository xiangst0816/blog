---
title: Manifest的使用
author: 烈风裘
date: 2016-10-20T14:09:22.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - 缓存
---

为了加快网页的访问速度，对请求资源进行缓存是一个常用的策略。当客户端发送资源请求后，如果资源未过期，则服务器返回 304 代表资源未修改使用浏览器本地缓存，但是这个过程还是会发生 TCP 连接，如果不发送请求就能知道本地的缓存副本就是最新的按就好了。

其中的一个解决方案就是使用 HTML5 的最新特性离线存储(manifest)来解决。通过离线存储，我们可以通过把需要离线存储在本地的文件列在一个 manifest 配置文件中，这样即使在离线的情况下，用户也可以正常使用 App。同时，由之前返回的 304(not modified)全部变成 200(from cache)，也即是说不用再请求服务器资源了。

> PS：应该是在单页面 SPA 应用中多使用此技术，除了 IE9 及其以下版本不兼容，其余浏览器都兼容。

### 怎么使用

在 html 中加入 manifest 的属性就可以了。

```html
<!DOCTYPE HTML>
<html manifest = "cache.manifest">
...
</html>
```

之后编写`cache.manifest`文件(此文件一般是通过自动化工具来做生成，手动维护很痛苦)

```
CACHE MANIFEST

CACHE:
http://cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css
http://cdn.bootcss.com/font-awesome/4.6.3/fonts/fontawesome-webfont.woff2?v=4.6.3
http://xiangsongtao.com/static/css/app.40ca310ea17e37e2c7d1be290f097782.css
http://xiangsongtao.com/static/js/0.cc35128bd8494c03daa0.js
http://xiangsongtao.com/static/js/1.9f1833ed33a94fe44f61.js
http://xiangsongtao.com/static/js/2.6fd53cc0491419739c75.js
http://xiangsongtao.com/static/js/3.7d2782ebd4a9ccfc73c3.js
http://xiangsongtao.com/static/js/4.3ffed0ad00e3cbf19311.js
http://xiangsongtao.com/static/js/5.0864b0b318aed8c5e5c3.js
http://xiangsongtao.com/static/js/6.8cf1f468ef4e49b1fb0d.js
http://xiangsongtao.com/static/js/7.da83992afd496d4889e3.js
http://xiangsongtao.com/static/js/8.a75be465a534de6bc590.js
http://xiangsongtao.com/static/js/app.88635de0da664917c9bc.js
http://xiangsongtao.com/static/js/manifest.c3d7bc712610ce511e9b.js
http://xiangsongtao.com/static/js/vendor.dd1992f099a201029616.js

NETWORK:
*

SETTINGS:
prefer-online

# hash: f98a3b3dac77c6644dc0795a6fb7e44ca03f41b33ff6d738d3da57b783abf5f1

FALLBACK:
/ /offline.html
```

SETTINGS 可以设置成两种模式，默认是 fast。但是在我的测试中没感觉到这两种模式有什么区别，这个就暂时不说了。

这些就是 manifest 缓存最基本的东西，还有一个很大的问题就是火狐的警告。当使用 manifest 时，火狐下会出现警告。

生成上述 manifest 文件的 gulp 配置如下：

```
'use strict';
var  gulp  = require('gulp');
var  gulpLoadPlugins  = require('gulp-load-plugins');
var $ = gulpLoadPlugins();

gulp.task('manifest', function(){
  gulp.src(['dist/static/**/*.{js,css}'], { base: './dist' })
    .pipe($.manifest({
      hash: true,
      preferOnline: true,
      prefix:'http://xiangsongtao.com/',
      network: ['*'],
      cache:[
        'http://cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css',
        'http://cdn.bootcss.com/font-awesome/4.6.3/fonts/fontawesome-webfont.woff2?v=4.6.3',
      ],
      filename: 'app.manifest',
      exclude: ['app.manifest']
    }))
    .pipe(gulp.dest('dist'));
});
```

### manifest 解析过程

在线情况第一次访问，则查找 html 中的 manifest 文件，如果有则下载里面需要缓存的资源。第二次访问的时候，浏览器使用本地缓存副本渲染网页，之后判断 manifest 中的文件是否更新，如果未更新则不操作；如果已更新，则下载最新副本缓存（也就是说，更新 manifest 后并不会立即生效，需要再刷新下）,这个问题我们可以用代码进行手动缓存的刷新解决，调用`window.applicationCache.update()`进行缓存刷新，`window.applicationCache.swapCache()`进行重新请求更新的资源进行渲染。

### manifest 过程对应的事件

```
 window.applicationCache.onnoupdate = function(){
            console.debug('onnoupdate!!!!')
}
```

1.  oncached:当离线资源存储完成之后触发这个事件，这个是文档的说法，我在 Chrome 上面测试的时候并没有触发这个事件（onobsolete 也是）。
2.  onchecking:当浏览器对离线存储资源进行更新检查的时候会触发这个事件
3.  ondownloading:当浏览器开始下载离线资源的时候会触发这个事件
4.  onprogress:当浏览器在下载每一个资源的时候会触发这个事件，每下载一个资源就会触发一次。
5.  onupdateready:当浏览器对离线资源更新完成之后会触发这个事件
6.  on 中 noupdate:当浏览器检查更新之后发现没有资源更新的时候触发这个事件
7.  onerror: 当 manifest 中缓存的资源下载错误是触发

### manifest 使用场景

manifest 的名字叫 Application Cache 就已经很好的定性了，它是用来构造离线应用程序的。比方说你写了个秒表，它离线也能用，这是 manifest 的应用场景。它会讲当前访问的 HTML 也缓存起来，故实时的 web 还是别用了。

如果要缓存资源，设置`Cache Control`和`Expires`来做吧，这个见我的另外一篇文章。

### 参考资源

- [Gulp-manifest](https://www.npmjs.com/package/gulp-manifest)
- [原文参考 1](https://segmentfault.com/a/1190000000732617)
- [原文参考 2](http://bin-playground.top)
- [Using_the_application_cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache)
- [LET’S TAKE THIS OFFLINE](http://diveintohtml5.info/offline.html)
