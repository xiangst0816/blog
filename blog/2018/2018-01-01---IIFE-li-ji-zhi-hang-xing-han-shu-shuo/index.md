---
title: IIFE立即执行函数
author: 烈风裘
date: 2018-01-01T08:40:10.537Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JavaScript
---

就是下面这样的的代码：

```js
(function foo() {
  console.log("Hello!");
})();
```

## 关于 IIFE 书写方式

#### 第一种情况：

```js
function(){ /* code */ }(); // SyntaxError: Unexpected token (
```

解释：JavaScript 在解析代码时，当遇到`function`关键字时，会默认把它当做一个**函数声明**，而**不是函数表达式**，如果没有把它显式的写成函数表达式，就报错，**因为函数声明需要一个函数名**。上面的报错是因为没有函数名(第一个左括号)。

#### 第二种情况：

```js
function foo(){ /* code */ }(); // SyntaxError: Unexpected token )
```

解释：在表达式后面加括号表示执行；此外，在函数声明一个语句，在语句后面加括号可等价为：

```js
function foo(){ /* code */ }
(); // SyntaxError: Unexpected token )
```

相当于声明了函数 foo，后面进行`()`的表达式操作。`()`表示分组操作符，内部**表达式**不能为空，所以报错，上面的报错是因为分组操作符内为空的错误。

#### 第三种情况：

```js
(function() {
  /* code */
})();
```

为什么这样就能立即执行并且不报错呢？因为在 javascript 里，括号内部不能包含语句，当解析器对代码进行解释的时候，先碰到了`()`，然后碰到 function 关键字就会**自动将`()`里面的代码识别为函数表达式而不是函数声明**。

因此，也可以这么写：

```js
(function() {
  /* code */
})();
```

此外，只要功能类似于`()`将**语句**转化为**表达式**的方式都能用于 IIFE，例如下面的写法都会生效：

```js
false ||
  (function() {
    console.log("hello");
  })();
true &&
  (function() {
    console.log("hello");
  })();
"anything",
  (function() {
    console.log("hello");
  })();

~(function() {
  console.log("hello");
})();
!(function() {
  console.log("hello");
})() +
  (function() {
    console.log("hello");
  })() -
  (function() {
    console.log("hello");
  })();

~(function() {
  console.log("hello");
})(); // 变种
```

#### 第四种情况：

```js
var i = (function() {
  return 10;
})();
```

这样的写法把`fucntion`当做函数表达式，可以不加`()`，但是为了增加代码可读性，建议加上。

## 和闭包的配合

### 1. 保存函数内部变量状态

下面代码并不会像你想象那样的执行，因为`i`的值没有被锁住，当我们点击链接的时候，其实 for 循环已经执行完了，于是在点击的时候 i 的值其实已经是 elems.length 了。

```js
var elems = document.getElementsByTagName("a");
for (var i = 0; i < elems.length; i++) {
  elems[i].addEventListener(
    "click",
    function(e) {
      e.preventDefault();
      alert("I am link #" + i);
    },
    "false"
  );
}
```

这样改写：

```js
var elems = document.getElementsByTagName("a");
for (var i = 0; i < elems.length; i++) {
  (function(i) {
    // 其实代码中的 i 和外面的 i 是在不同的作用域里完全不同，比如：
    elems[i].addEventListener(
      "click",
      function(e) {
        e.preventDefault();
        console.log("I am link #" + i);
      },
      "false"
    );
  })(i);
}
```

IIFE 代码中的`i`和外面的`i`是在不同的作用域里，完全不同的两个值，只是名字一样。

### 2. 局部变量、模块化

立即执行函数在模块化中也大有用处。用立即执行函数处理模块化可以减少全局变量造成的空间污染，构造更多的私有变量。

```js
// 创建一个立即执行的匿名函数
// 该函数返回一个对象，包含你要暴露的属性
// 如下代码如果不使用立即执行函数，就会多一个属性i
// 如果有了属性i，我们就能调用counter.i改变i的值
// 对我们来说这种不确定的因素越少越好

var counter = (function() {
  var i = 0;

  return {
    get: function() {
      return i;
    },
    set: function(val) {
      i = val;
    },
    increment: function() {
      return ++i;
    }
  };
})();

// counter其实是一个对象

counter.get(); // 0
counter.set(3);
counter.increment(); // 4
counter.increment(); // 5

counter.i; // undefined i并不是counter的属性
i; // ReferenceError: i is not defined (函数内部的是局部变量)
```

## 总结

- 能转化为函数表达式的操作都能构造 IIFE
- IIFE 和普通函数类似，可以传参，有返回值
- IIFE 可以制造局部变量，用于模块化

## 参考

- [详解 javascript 立即执行函数表达式（IIFE）](http://web.jobbole.com/82520/)
