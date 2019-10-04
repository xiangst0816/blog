---
title: 第十七章 错误处理及调试
author: 烈风裘
date: 2018-03-19T03:48:41.775Z
draft: false
comments: true
star: false
cover: ''
tags:
  - JS高程
---

### 1. try-catch

```js
try {
  // 可能会导致错误的代码
} catch (error) {
  // 在错误发生时怎么处理
}
```

- 在**可能发生错误的地方使用 try-catch 语句**
- catch 中的 error 错误对象必须要写, 不可忽略
- error.message: 错误消息
- error.name: 错误名称

### 2. 下面包含`finally`语句的代码返回值时?

```js
function testFinally() {
  try {
    return 2;
  } catch (error) {
    return 1;
  } finally {
    return 0;
  }
}
```

- finally 子句一经使用，其代码无论如何都会执行
- 如果 finally 包含 return, 则会忽略上面的所有 return
- 上例子中返回 0

### 3. 报错的 error 类型种类, 如何获取类型?

- Error: 基类错误
- EvalError: 执行 eval()错误
- RangeError: 范围错误
- ReferenceError: 对象中属性未找到
- SyntaxError: 语法错误, 比如错误的字符串传入 `JSON.parse()` / `eval()`
- TypeError: 类型错误
- URIError: 在使用 encodeURI()或 decodeURI(), uri 格式不对报错

可以通过 `instanceof`操作符 获取错误类型.

### 4. 如何创建自定义错误类型并抛出?

```js
function CustomError(message) {
  this.name = "CustomError";
  this.message = message;
}

CustomError.prototype = new Error();
CustomError.prototype.constructor = CustomError;

throw new CustomError("This is a message!");
```

### 5. 在 try-catch 捕获错误和 throw 抛出错误两个阶段应该注意什么?

- **try-catch 捕获错误**: 应该捕获确切知道如何处理的错误
- **throw 抛出**: 错误应该提供详细的信息

### 6. error 事件触发时机?

任何没有通过 try-catch 处理的错误都会**触发 window 对象的 error 事件**。

### 7. error 事件监听

**只能这样使用!!**

```js
window.onerror = function(message, url, line) {
  alert(message);
  return false; // 阻止浏览器报告错误的默认行为
};
```

- 通过**返回 false**，这个函数实际上就**充当了整个文档中的 try-catch 语句**，可以捕获所有无代码处理的运行时错误。
- 理想情况下，只要可能就不应该使用它
- 只要能够适当地使用 try-catch 语句，就不会有错误交给浏览器，也就不会触发 error 事件。

### 8. 常见错误如何避免?

**类型转化错误**

- 使用**全等`===`**和**非全等`!==`**操作符，可以避免发生因为使用相等和不相等操作符引发的类型 转换错误，因此我们强烈推荐使用
- 像 `if` 之类的语句在确定下一步操作之前， 会**自动把任何值转换成布尔值**, 避免错误就要做到在条件比较时**切实传入布尔值**。

**数据类型错误**

- 传参需要手动判断下类型, 避免错误
- **基本类型**的值应该使用 `typeof` 来检测, string/number/function/boolean
- **对象**的值则应该使用 `instanceof` 来检测, array/object
- 基本库**必须**进行入参类型检查!

**通信错误**

- url 编码错误, 比如没正确使用`encodeURIComponent`函数, 解决方式如下:

```js
function addQueryStringArg(url, name, value) {
  if (url.indexOf("?") == -1) {
    url += "?";
  } else {
    url += "&";
  }
  url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  return url;
}
```

- 在服务器响应的数据不正确时，也会发生通信错误
- 动态加载脚本和动态加载样式

### 9. 归一化 error 对象的方法

```js
/**
 * 监听全局的js文件错误
 * @param {String}  message   错误信息
 * @param {String}  script    出错的文件
 * @param {String}  line      出错代码的行号
 * @param {String}  column    出错代码的列号
 * @param {Object}  errorObj  错误的详细信息，Anything
 */
window["onerror"] = function(message, script, line, column, errorObj) {
  _ins.error(
    normalizeError({
      message: message,
      name: !!errorObj && (errorObj.message || message.split(":")[1].trim()),
      script: script,
      line: line,
      stack: !!errorObj && errorObj.stack
    })
  );
  return true;
};

// Normalize Error objects across all browsers into something semi-standard.
// Not all properties are will be available, but if they are, they'll at
// least have a predictable property name.
function normalizeError(err) {
  var o = {
    message: err.message,
    script: err.fileName || err.sourceURL || err.script,
    name: err.name,
    line: err.lineNumber || err.line,
    stack: err.stackTrace || err.stack
  };

  // Chrome doesn't provide script/line # properties in Error objects, and
  // only reports the script/line # of where an error was last rethrown (as
  // opposed to the original throw point).  So we scrape the stack trace to
  // get that info
  if (
    window.chrome &&
    err.stack &&
    /(\w{3,5}:\/\/[^:]+):(\d+)/.test(err.stack)
  ) {
    o.script = RegExp.$1;
    o.line = RegExp.$2;
  }
  // Clear out undefined properties
  for (var k in o) {
    if (o[k] === null || o[k] === undefined) {
      delete o[k];
    }
  }
  return o;
}
```

### 10. 如何捕获`Promise`抛出的错误？

#### 主动捕获

```js
Promise.resolve("a:1")
  .then(JSON.parse)
  .then(
    json => {
      console.log("不会执行到这里", json);
    },
    err => {
      //这儿捕获的是上一个JSON.parse时的错误
      console.log("上面err在这里被处理", err.message);
      //Unexpected token a
    }
  )
  .catch(err => {
    console.log("不会触发这个error", err);
  })
  .then(() => {
    console.log("任然执行");
  });
```

#### 被动监听

```js
// 浏览器
window.addEventListener("unhandledrejection", e => {});
// nodejs
process.on("unhandledRejection", function(reason, promise) {
  console.log(reason); // [Error: unhandledrejection]
  console.log(promise); // Promise { <rejected> [Error: unhandledrejection] }
});
```

参考这篇文章，[Tracking unhandled rejected Promises](http://2ality.com/2016/04/unhandled-rejections.html)
