---
title: H5移动开发总结
author: 烈风裘
date: 2016-10-20T01:08:45.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Mobile
---

## 透明度

主要是兼容 IE6+的写法，当我们在兼容低版本浏览器的时候可能下面的写法可以满足我们的需求（两个属性都写上，浏览器识别的属性直接覆盖前者的属性）：

```
.item1{
    opacity:0.1;
    //IE8以上浏览器识别
    filter: progid:DXImageTransform.Microsoft.Alpha(opacity=70);
    //滤镜低版本IE7-8支持
}
```

## html5 标签唤起发短信功能

做 html5 开发的过程中，我们可能会有这样的需求：

点击按钮，呼起系统的发送短信的窗口，并且自动填充发送到的号码和内容。网络上可以很容易的找到这方面的 demo ，并且也可以找到在安卓上和 iOS 上是有却别的（body 之前的标示）：

```
<!-- ios UC浏览器-->
<a href="sms:10086?body=发送的内容">点击我发送短信</a>
<!-- ios <=ios7-->
<a href="sms:10086;body=发送的内容">点击我发送短信</a>
<!-- ios >=ios8-->
<a href="sms:10086&body=发送的内容">点击我发送短信</a>
<!-- android-->
<a href="sms:10086?body=发送的内容">点击我发送短信</a>
```

这里有图片

## input 标签选择系统文件的问题

在 html5 中 input 标签提供给了开发者访问系统文件的能力。在移动端的系统浏览器中使用 input 控件没有什么问题。但是在 app 的**webview**中需要注意，webview 读取系统文件是需要有权限的，如果权限未设置会出现 bug，IOS 和 Android 同理。

## 多页面 html 如何传递数据

传统的方法是在页面 url 的 query 中添加参数，但是需要处处携带。但是使用本地存储就可以解决。这个是淘宝的一个面试题，不过熟悉 sessionStroage 及 localStorage 的同学应该知道怎么办了。

另外，在 app 的**webview**中需要注意，IOS 和 Android 的同学开启 localStorage 向磁盘写文件的权限。

## JS 在客户端生成二维码或者一维码

这个能实现，使用 qrcodejs 或者 jQuery.qrcide 插件。前辈总结的图用下：

这里有图！！

## 本地存储 JS 字符串并解析

最终的书写代码如下：

```
var fnStr = 'return function (){console.log("you are here!")}'
var fn = new Function(fnStr);
fn()
-> function (){console.log("you are here!")}
fn()()
-> you are here!
```

## 键盘被呼起模拟滚动

在移动端浏览器中，正常情况下点击 Input 是能自动滚动页面让 input 和键盘显示在一起。但是在某些 webview 中需要 js 模拟唤起，下面是实现代码：

```
function inputScroll(dom){
var tplList=['ss','bb'] ;

var tpl = $.fn.getQueryString(tpl);
  if(tplList.indexOf(tpl)){
    dom.focus(function(){
      var clientHeight = $(window).height();
      var contentHeight = clientHeight + clientHeight/2;
      var smsInputTop= $(this).offset().top;

      content.height(contentHeight);
      window.scrollTo(0,smsInputTop-76);
    });
  }
}
```

## 参考

- [移动端 h5 开发相关内容总结（四）](https://github.com/zhiqiang21/blog/issues/27)
