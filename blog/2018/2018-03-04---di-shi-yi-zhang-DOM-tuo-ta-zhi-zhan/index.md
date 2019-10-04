---
title: 第十一章 DOM拓展
author: 烈风裘
date: 2018-03-04T13:47:59.568Z
draft: false
comments: true
star: false
cover: ''
tags:
  - JS高程
---

### 1. DOM 选择符 API

根据 **CSS 选择符** 选择与某个模式匹配的 DOM 元素.

- `querySelector()`

IE8+, 返回第一个匹配的 Node

- `querySelectorAll()`

IE8+, 返回 NodeList

- `matchesSelector()`

IE9+, 如果调用元素与该选择符匹配，返回 true；否则，返回 false。

这个 API 并未全部支持, 可用下面方式使用:

```js
function matchesSelector(element, selector) {
  if (element.matchesSelector) {
    return element.matchesSelector(selector);
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector);
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector);
  } else {
    throw new Error("Not supported.");
  }
}

if (matchesSelector(document.body, "body.page1")) {
  //执行操作
}
```

### 2. ElementNode 类型 Node 查询增强 API

- childElementCount：返回子元素（不包括文本节点和注释）的个数。
- firstElementChild：指向第一个子元素；firstChild 的元素版。
- lastElementChild：指向最后一个子元素；lastChild 的元素版。
- previousElementSibling：指向前一个同辈元素；previousSibling 的元素版。
- nextElementSibling：指向后一个同辈元素；nextSibling 的元素版。

支持情况: IE 9+

### 3. HTML5 中操作`class`属性的方法和传统方法的对比?

- 传统方法使用`className`属性对字符串的处理来更改 class:

```js
//删除"user"类

//首先，取得类名字符串并拆分成数组
var classNames = div.className.split(/\s+/);

//找到要删的类名 var pos = -1, i, len;
for (i = 0, len = classNames.length; i < len; i++) {
  if (classNames[i] == "user") {
    pos = i;
    break;
  }
}

//删除类名
classNames.splice(i, 1);

//把剩下的类名拼成字符串并重新设置
div.className = classNames.join(" ");
```

- HTML5 使用`classList`属性, Firefox 3.6+和 Chrome

```js
//删除"disabled"类
div.classList.remove("disabled");

//添加"current"类
div.classList.add("current");

//切换"user"类
div.classList.toggle("user");

//确定元素中是否包含既定的类名
if (div.classList.contains("bd") && !div.classList.contains("disabled")) {
  //执行操作
}

//迭代类名
for (var i = 0, len = div.classList.length; i < len; i++) {
  doSomething(div.classList[i]);
}
```

### 4. 焦点管理

- `document.activeElement()`: 始终会引用 DOM 中当前获得了焦点的元素
- `document.hasFocus()`: 用于确定文档是否获得了焦点

### 5. HTMLDocument 的变化

#### document.readyState

通过它来实现一个指示文档已经加载完成的指示器, 支持情况: IE4+

- loading，正在加载文档；
- complete，已经加载完文档。

```js
function docReady(cb) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    cb();
  } else {
    document.addEventListener("DOMContentLoaded", completed, false);
    window.addEventListener("load", completed, false);
  }

  /* istanbul ignore next */
  function completed() {
    document.removeEventListener("DOMContentLoaded", completed, false);
    window.removeEventListener("load", completed, false);
    cb();
  }
}
```

#### document.compatMode

- 标准模式(CSS1Compat), 比如 doctype 设置为`<!DOCTYPE html>`时

- 混杂模式(BackCompat, 向后兼容模式)的 doctype 可以是:

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
```

判断代码:

```js
if (document.compatMode == "CSS1Compat") {
  alert("标准模式");
} else {
  // "BackCompat"
  alert("混杂模式, 向后兼容模式");
}
```

#### document.head

作为对 document.body 引用文档的<body>元素的补充，HTML5 新增了 document.head 属性， 引用文档的<head>元素

```js
var head = document.head || document.getElementsByTagName("head")[0];
```

### 6. HTML5 中自定义数据属性的应用? 如何兼容不支持浏览器?

- 用于元素渲染外的信息, 需要添加"data-"头, 但是获取时不需要"data".
- 用于**跟踪连接/混搭引用/插件参数/埋点数据**等应用
- Firefox 6+和 Chrome

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

```js
//本例中使用的方法仅用于演示
var div = document.getElementById("myDiv");

//取得自定义属性的值
var appId = div.dataset.appId;
var myName = div.dataset.myname;

//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";
```

如果不兼容, 可参考下面代码:

```js
if (myDiv.dataset) {
  myDiv.dataset.attribute = "valueXX"; // 设置自定义属性
  var theValue = myDiv.dataset.attribute; // 获取自定义属性
} else {
  myDiv.setAttribute("data-attribute", "valueXX"); // 设置自定义属性
  var theValue = myDiv.getAttribute("data-attribute"); // 获取自定义属性
}
```

### 7. 插入标记字符串的方式有哪些及优势和问题?

传统的方式是通过创建一个个节点再拼接插入, 量大会比较麻烦, 有三种形式可以使用:

#### innerHTML

- 读模式: 获取指定节点的**所有子节点对应的 HTML 标记字符串**.
- 写模式: 根据指定的值创建新的 DOM 树, 然后在用这个 DOM 数完全**替换调用元素原先的所有子节点**
- **不要指望所有浏览器返回的值时是一致的**
- **写和读两次的值也可能不一样**, 原因是返回的字符串是根据原始 HTML 字符串创建的 DOM 数经过序列化后的结果
- 插入`<script>` 时可能会有些限制, 在大多数浏览器中，通过 innerHTML 插入 `<script>` 元素并不会执行其中的脚本(**IE8 及更早版本是唯一能在这种情况下执行脚本的浏览器**，但必须满足一 些条件。解决办法就是在插入的 script 前再插入一个有作用域的元素, 比如文本/空字符的 div/**隐藏的 input(首选)**等).
- 插入脚本还是使用别的方式吧
- 插入`<style>`大多数浏览器都支持, IE8 及更早版本的 Hack 这里不做说明, 代码如下:

```js
div.innerHTML = '<style type="text/css">body {background-color: red; }</style>';
```

#### outerHTML

用法和 innerHTML 类似, 不过是所有结果都包含自身.

```js
// 使用 outerHTML 属性以下面这种方式设置值：
div.outerHTML = "<p>This is a paragraph.</p>";

// 这行代码完成的操作与下面这些 DOM 脚本代码一样：
var p = document.createElement("p");
p.appendChild(document.createTextNode("This is a paragraph."));
div.parentNode.replaceChild(p, div);
```

#### insertAdjacentHTML()

四个插入位置的字符串说明如下代码所示, 字符串说明会比较难懂:

```js
//作为前一个同辈元素插入
element.insertAdjacentHTML("beforebegin", "<p>Hello world!</p>");

//作为第一个子元素插入
element.insertAdjacentHTML("afterbegin", "<p>Hello world!</p>");

//作为最后一个子元素插入
element.insertAdjacentHTML("beforeend", "<p>Hello world!</p>");

//作为后一个同辈元素插入
element.insertAdjacentHTML("afterend", "<p>Hello world!</p>");
```

#### 内存与性能问题注意

- 使用上述 API 比单独创建元素要高效的多, 建议使用
- 删除元素前**别忘记解绑事件监听**, 否则出现内存泄露
- 这是 innerHTML 或者 outerHTML 会创建 HTML 解析器, 一次频繁创建会影响性能, **建议控制调用上述三个 API 的次数**, 比如缓存字符串中间结果

### 8. scrollIntoView()方法

### 8. 在移动端当键盘遮挡输入框该如何处理?

> 文章来源: [https://github.com/justjavac/the-front-end-knowledge-you-may-dont-know/issues/3](https://github.com/justjavac/the-front-end-knowledge-you-may-dont-know/issues/3)

使用`Element.scrollIntoViewIfNeeded(opt_center)`, 就是在需要的时候将元素滚动到可视区域。

```js
//让元素可见, 窗口滚动 之后会让调用元素的顶部与视口顶部尽可能平齐
document.forms[0].scrollIntoView();
document.forms[0].scrollIntoView(true);
// Safari 和 Chrome 实现了这个方法
document.forms[0].scrollIntoViewIfNeeded(true);

// 只是让元素可见
document.forms[0].scrollIntoView(false);
```
