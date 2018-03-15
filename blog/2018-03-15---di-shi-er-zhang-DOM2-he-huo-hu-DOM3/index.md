---
title: 第十二章 DOM2和DOM3
author: 烈风裘
date: 2018-03-15T01:32:35.256Z
draft: false
comments: false
star: false
cover: ''
tags: 
  - 未归档
---


### 1. 为什么`ele.style`属性获取到的样式信息不全?

这个 style 对象 是 CSSStyleDeclaration 的实例，包含着**通过 HTML 的 style 特性指定**的所有样式信息，但**不包含**与**外部**样式表或**嵌入**样式表经层叠而来的样式。

使用`getComputedStyle()`可以获取包含当前元素的所有计算的样式. 方法接收两个参数: 要取得计算样式的元素和一个伪元素字符串（例如":after"）

```js
var myDiv = document.getElementById("myDiv"); 
var computedStyle = document.defaultView.getComputedStyle(myDiv, null);
```
- 注意**综合属性**的返回值, 比如border
- 无论在哪个浏览器中，最重要的一条是要记住所有计算的样式都是**只读**的


### 2. getBoundingClientRect()获取元素尺寸

```js
function getBoundingClientRect(element){
	var scrollTop = document.documentElement.scrollTop; 
	var scrollLeft = document.documentElement.scrollLeft;
	if (element.getBoundingClientRect){
		if (typeof arguments.callee.offset != "number"){ 
			var temp = document.createElement("div"); 
			temp.style.cssText = "position:absolute;left:0;top:0;"; 			document.body.appendChild(temp); 
			arguments.callee.offset = -temp.getBoundingClientRect().top - scrollTop; 
			document.body.removeChild(temp);
			temp = null;
		}
		var rect = element.getBoundingClientRect(); 
		var offset = arguments.callee.offset;
		return {
			left: rect.left + offset, 
			right: rect.right + offset, 
			top: rect.top + offset, 
			bottom: rect.bottom + offset
		}; 	
	} else {
		var actualLeft = getElementLeft(element); 
		var actualTop = getElementTop(element);
		return {
			left: actualLeft - scrollLeft, 
			right: actualLeft + element.offsetWidth - scrollLeft, 
			top: actualTop - scrollTop, 
			bottom: actualTop + element.offsetHeight - scrollTop 
		}
	}
}
```

### 3. DOM遍历接口

可能会在VDOM中使用. IE9+
