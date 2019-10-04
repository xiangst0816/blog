---
title: Fastclick原理浅析
author: 烈风裘
date: 2017-12-08T13:38:12.124Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Mobile
---

### 为什么使用 FastClick

在移动端 H5 开发过程中，关于点触可能会遇到如下两个问题：

- 手动点击与真正触发`click`事件会存在 300ms 的延迟
- 点击穿透问题（点击行为会穿透元素触发非父子关系元素的事件）

延迟的存在时因为浏览器想知道你[是否在进行双击操作](https://developers.google.com/mobile/articles/fast_buttons)；而点击穿透是因为 300ms 延迟触发时的副作用。而使用 fastclick 能很好的解决这个问题，增加使用者的体验。

### 可以不使用的场景

不必使用的浏览器环境如下：

- Android + Chrome >32
- Android + Chrome + `meta="user-scalable=no"`
- 部分黑莓手机环境（可略过）
- 部分 WindowsPhone 环境（可略过）

这部分的判断在下面的方法中有体现，如果当前环境支持快速点击，则 FastClick 会自动跳过初始化。

```js
FastClick.notNeeded = function(layer) { ... }
```

### 原理过程

如果完整的描述 FastClick 过程需要考虑多种场景的兼容，**这里就描述一个按钮点击过程的处理**，下面是用来描述的代码：

```js
// 业务代码
var $test = document.getElementById("test");
$test.addEventListener("click", function() {
  console.log("1 click");
});

// FastClick简单实现
var targetElement = null;
document.body.addEventListener("touchstart", function() {
  // 记录点击的元素
  targetElement = event.target;
});
document.body.addEventListener("touchend", function(event) {
  // 阻止默认事件（屏蔽之后的click事件）
  event.preventDefault();
  var touch = event.changedTouches[0];
  // 合成click事件，并添加可跟踪属性forwardedTouchEvent
  var clickEvent = document.createEvent("MouseEvents");
  clickEvent.initMouseEvent(
    "click",
    true,
    true,
    window,
    1,
    touch.screenX,
    touch.screenY,
    touch.clientX,
    touch.clientY,
    false,
    false,
    false,
    false,
    0,
    null
  );
  clickEvent.forwardedTouchEvent = true; // 自定义的
  targetElement.dispatchEvent(clickEvent);
});
```

#### 这里进行过程说明：

##### 1. 业务正常使用 click 绑定事件

##### 2. 在 document.body 绑定`touchstart`和`touchend`

**`touchstart`**

用于记录当前点击的元素 targetElement；

**`touchend`**

- 阻止默认事件（屏蔽之后的 click 事件）
- 合成 click 事件，并添加可跟踪属性 forwardedTouchEvent
- 在 targetElement 上触发`click`事件
- targetElement 上绑定的事件立即执行，完成 FastClick

##### 3. 执行业务自己的 click 事件

### 总结

以上就完成了模拟 FastClick，是不是很简单。事件的执行过程需要了解：touch 事件先于 mouse 事件先于 click 执行，因此可以在 document.body 上绑定事件用于监听点触行为，根据需要模拟 click 触发真正需要响应的元素。

(完)
