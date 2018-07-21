---
title: 第八章 BOM
author: 烈风裘
date: 2018-02-28T02:15:18.470Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

### 1. `window`/`top`/`self`/`parent`/`Global`这些对象的含义和区别?

- `window`，它表示浏览器的一个实例
- `window` 对象还是 ECMAScript 中的 `Global` 对象，因而所有全局变量和函数都是它的属性，且所有原生的构造 函数及其他函数也都存在于它的命名空间下
- 此外, 页面可能包含很多 frames
- `top` 对象始终指向最外围的框架(frames)，也就是整个浏览器窗口
- `parent` 对象表示包含当前框架的框架，而 self 对象则回指 `window`
- 在没有框架的情况下，`parent` 一定等于 `top`（此时它们都等于 `window`）
- 与框架有关的最后一个对象是 self，它始终指向 `window`；实际上，`self` 和 `window` 对象可以互 换使用, 引入 `self` 对象的目的只是为了与 `top` 和 `parent` 对象对应起来，因此它不格外包含其他值。

### 2. 为什么不建议在全局对象上保存业务变量?

- 在全局作用域中定义了的变量和函数，它们被自动归在了 window 对象 名下
- **注意:** 在 window 对象上定义属性在 IE>=9 时能安全删除. "自动行为"不可以.
- 命名冲突等
- 以上就是可能存在的问题

```js
var age = 29; // IE >=9 不能安全删除
window.color = "red"; // IE >=9 可安全删除

//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 false
delete window.age;

//在 IE < 9 时抛出错误，在其他所有浏览器中都返回 true
delete window.color; //returns true

alert(window.age); //29
alert(window.color); //undefined
```

### 3. 获取窗口位置及移动窗口的接口有什么问题?

- **无法在跨浏览器的条件下**取得窗口左边和上边的**精确坐标值**
- 使用 moveTo() 和 moveBy() 方法倒是有可能将窗口精确地移动到一个新位置, 但是不一定会生效, 因为可能会被浏览器禁用

### 4. 浏览器窗口大小 api 有什么使用问题?

- 无法确定浏览器窗口本身的大小，但却可以取得页面视口的大小
- 使用 resizeTo()和 resizeBy()方法可以调整浏览器窗口的大小, 也有可能被浏览器禁用

### 5. 使用 window.open()的问题?

可能会因为**安全问题**屏蔽代码自动开启新窗口.

### 6. history.length 的含义?

这个数量 包括所有历史记录，即所有向后和向前的记录。因此, **无法通过这个判断当前页面进入的方式(前进/后退), 需要内建记录判断**.
