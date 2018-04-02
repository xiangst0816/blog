---
title: JSONP跨域访问服务
author: 烈风裘
date: 2015-11-11T09:42:55.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JSONP
---

**跨域访问:**

> 如果我们希望获取的数据和当前页面并不是一个域，著名的同源策略（不同域的客户端脚本在没明确授权的情况下，不能读写对方的资源）会因为安全原因决绝请求，也就是我们不能向其它域直接发送请求以获取资源。

**iframe、img、style、script 等元素**的 src 属性可以直接向不同域请求资源，jsonp 正是利用 script 标签跨域请求资源的

**异域服务器的 php 代码:**

```php
<?php
  $path=$_SERVER["DOCUMENT_ROOT"].'/books.xml';
  $json=json_encode(simplexml_load_file($path));
  $callbackFn=$_GET['callback'];
  echo "$callbackFn($json);";
?>
```

将 xml 数据转化成 json,之后将传入的 callback 的值作为函数名传入 json 数据,之后 echo.

**本地 callback 函数**

```js
function displayBooks(books){
	****
}
```

**本地 jsonp 请求发送**

写一个`<script>`标签用于跨域

```js
function getBooks() {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute(
    "src",
    "http://test.com/bookservice.php?callback=displayBooks"
  );
  document.body.appendChild(script);
}
getBooks();
```

**jquery 实现**

```js
function getBooks() {
  $.ajax({
    type: "get",
    url: "http://test.com/bookservice.php",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "displayBooks"
  });
}
```

```

```
