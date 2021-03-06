---
title: setTimeout延时0毫秒的作用
author: 烈风裘
date: 2016-10-20T14:09:45.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JavaScript
---

相信这样的代码`setTimeout(function () {},0)`我们都是遇到过的, 但是思考为什么这么用而不用其他的办法的人估计就很少了，今天遇到，在此记录。

## 先解释下 JavaScript 单线程模型

[原文由此进入](http://www.cnblogs.com/silin6/p/4333999.html)

首先我们来看浏览器下的 JavaScript：

浏览器的内核是多线程的，它们在内核制控下相互配合以保持同步，一个浏览器至少实现三个常驻线程：**JavaScript 引擎线程**，**GUI 渲染线程**，**浏览器事件触发线程**。

- JavaScript 引擎是基于事件驱动单线程执行的，JS 引擎一直等待着任务队列中任务的到来，然后加以处理，浏览器无论什么时候都只有一个 JS 线程在运行 JS 程序。
- GUI 渲染线程负责渲染浏览器界面，当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时,该线程就会执行。但需要注意 GUI 渲染线程与 JS 引擎是互斥的，当 JS 引擎执行时 GUI 线程会被挂起，GUI 更新会被保存在一个队列中等到 JS 引擎空闲时立即被执行。[如何触发重绘操作]()
- 事件触发线程，当一个事件被触发时该线程会把事件添加到待处理队列的队尾，等待 JS 引擎的处理。这些事件可来自 JavaScript 引擎当前执行的代码块如`setTimeOut`、也可来自浏览器内核的其他线程如`鼠标点击事件`、`AJAX异步请求`等，但由于 JS 的单线程关系所有这些事件都得排队等待 JS 引擎处理。（当线程中没有执行任何同步代码的前提下才会执行异步代码）。[事件]()

js 的单线程在这一段面试代码中尤为明显（理解即可，请不要尝试...浏览器会假死的）：

```
var isEnd = true;
window.setTimeout(function () {
    isEnd = false; //1s后，改变isEnd的值
}, 1000);
//这个while永远的占用了js线程，所以setTimeout里面的函数永远不会执行
while (isEnd);
//alert也永远不会弹出
alert('end');
```

在我工作中对 js 的认识，个人认为 js 的任务单位是**函数**。即，一个函数表示着一个任务，这个函数没有执行结束，则在浏览器中当前的任务即没有结束。

上面的代码中，当前任务因为 while 的执行而造成永远无法执行，所以后面的 setTimeout 也永远不会被执行。它在浏览器的任务队列中如图所示：

![](http://xiangsongtao.com/uploads/1474859133000.png)

> 另外值得一提的是，setTimeout 会将内部 Fn 所需的执行环境保存挂载任务的末尾，因此如果 setTimeout 过多，在 node 端会造成内存泄露，因此在 node 端慎用。

## 实现 javascript 的异步；

> javascript 异步表示 async，指：代码执行不按顺序，‘跳过’执行，待其他某些代码执行完后，再来执行，称为“异步”。
> javascript 同步表示 sync，指：代码依次执行。

当然，这个‘异步’是模拟的形式出现的。正常情况下 javascript 都是按照顺序执行的。但是我们可能让该语句后面的语句执行完再执行本身，这时就可以用到 setTimeout 延时 0ms 来实现了，将 setTimeout 内部函数放到同步函数的外面执行（**setTimeout 内部函数放到了当前执行函数的外面**）。如：

```
alert(1);
setTimeout("alert(2)", 0);
alert(3);
```

虽然延时了 0ms,但是执行顺序为：1，3，2
这样就保证 setTimeout 里面的语句在某一代码段中最后执行。

因此：**我们应该认识到，利用 setTimeout(fn,0)的特性，可以帮助我们在某些极端场景下，修正浏览器的下一个任务。**

（完）
