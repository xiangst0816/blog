---
title: 闭包
author: 烈风裘
date: 2018-01-01T11:11:23.155Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JavaScript
---

写代码的时候经常用到，但是被问起却哑口无言，或者只能说到表面，这里再详细总结写，查漏补缺。

## 介绍

JavaScript 变量定义的作用域范围是**函数级作用域**，函数内部定义的变量在外部是访问不到的，但是有些场景需要能访问函数内部的状态，或者函数记录自己内部状态，因此引入闭包的概念。

> 闭包：能够读取其他函数内部变量的函数，或者是“定义在一个函数内部的函数”。

返回出来的函数为了保证自身运行依旧保留自身的作用域链关系，因此函数内部状态得以保存，而未被销毁。

## 用途

闭包的用途有两个：

- 可以读取函数内部的变量
- 让这些变量值始终保持在内存中（Node 中使用会存在内存泄露）

## 测试

#### 1. 测试一

```js
var name = "The Window";
var object = {
  name: "My Object",
  getNameFunc: function() {
    return function() {
      return this.name;
    };
  }
};
alert(object.getNameFunc()()); // 'The Window'
```

说明：

`object.getNameFunc()`执行后返回的函数已经和 object 无关系，只是单纯的函数，之后在执行相当于是在 window 上执行，因此结果是`The Window`

#### 2. 测试二

```js
var name = "The Window";
var object = {
  name: "My Object",
  getNameFunc: function() {
    var that = this;
    return function() {
      return that.name;
    };
  }
};
alert(object.getNameFunc()()); // 'My Object'
```

说明：

缓存的`that`变量指向 object，内部变量被保存，形成闭包。
