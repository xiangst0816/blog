---
title: 第七章 函数表达式
author: 烈风裘
date: 2018-01-08T14:11:04.471Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

## 问答

### 1. 函数声明的语法是?

```js
function test() {
  // ...
}
```

### 2. 函数表达式(匿名函数)的语法是?

```js
var test = function() {
  // ...
};
```

### 3. 以下递归语句是否报错, 报错原因是? 如何改进?

```js
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}

var anotherFactorial = factorial;
factorial = null;
anotherFactorial(4);
```

错误: Uncaught TypeError: factorial is not a function

原因: 函数 factorial 内部的 factorial 指向 null, 因此报错.

方法 1: arguments.callee, **它指向当前正在执行的函数指针**. 但是严格模式不允许使用.

```js
function factorial (num) {
  if (num <= 1) {
    return 1
  } else {
    return num * arguments.callee(num - 1)
  }
```

方法 2: 函数表达式

```js
var factorial = function f(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * f(num - 1);
  }
};
```

### 4. 闭包的概念?

有权访问另一个函数作用域中的变量的函数(或其他). 只要不被垃圾回收机制回收即可, 不一定需要返回函数, 方式有:

- 在一个函数中返回另一个函数, 返回的函数中包含上层函数的活动对象和全局对象(层层向外, 不止两层)
- 在函数中将内部状态保存在外部变量中.

```js
var test = (function() {
  var test = 123;
  function fn() {
    return test;
  }
  TEST = {
    test: test,
    fn: fn
  };
})();
console.log(TEST.fn()); // 123 , 注意: window.TEST === TEST
console.log(TEST); // {test:123, fn:f}
```

### 5. 在闭包中, 函数被调用的时候都发生了什么?

```js
function createComparisonFunction(propertyName) {
  return function(object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}

// 创建函数
var compareNames = createComparisonFunction("name");
// 调用函数
var result = compareNames({ name: "Nicholas" }, { name: "Greg" });
// 解除对匿名函数的引用,释放内存
compareNames = null;
```

![创建createComparisonFunction函数](http://upload-images.jianshu.io/upload_images/2036128-301cd9d6e78ff86b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1.  当**创建`createComparisonFunction`函数时**, 会创建一个预先包含**全局变量对象**的作用域链, 这个作用域链被保存在当前函数内部的`[[Scopes]]`属性中.

![执行createComparisonFunction函数](http://upload-images.jianshu.io/upload_images/2036128-6a26a491737f55a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2.  当**执行`createComparisonFunction`函数时**, 会创建一个**执行环境(execution context)**, 通过复制函数的`[[Scopes]]`属性中的对象构建起执行环境的**作用域链**.

3.  使用`arguments`和其他 _形参/变量/函数声明_ 初始化函数的 **活动对象(activation object)**, 即另一种局部变量对象, 并被推入执行环境作用域链的顶端. 这里需要补充**变量提升及优先级**的说明.

4.  此时, `createComparisonFunction`函数的执行环境中的作用域链包含多个变量对象:

    - 0: 本地活动对象
    - 1: 引用的外层函数变量对象
    - n-1: ...
    - n: 全局变量对象.

5.  显然, **作用域链的本质是一个指向变量对象的指针列表**, 它只包含引用但不实际包含变量对象.

6.  当在函数中访问一个变量时, 就会从作用域链中搜索具有相应名字的变量(变量标识符匹配过程). 这里可以补充优化机制.

7.  当**`createComparisonFunction`函数执行完毕时**, 其**执行环境的作用域链**会被销毁.

![创建闭包](http://upload-images.jianshu.io/upload_images/2036128-c107954d8c374586.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

8.  当匿名函数从`createComparisonFunction`函数中返回后, 它的作用域链被初始化为包含`createComparisonFunction`函数的活动对象和全局变量对象.

![执行闭包](http://upload-images.jianshu.io/upload_images/2036128-fdd6a7e0274f0778.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

9.  因此, 即使`createComparisonFunction`函数执行完毕, 但是它的活动对象仍然会留在内存中, 直到匿名函数主动销毁, `createComparisonFunction()`的活动对象才会被销毁. 这里需要补充**JS 垃圾回收及标记清除机制**.

注意:

1.  **闭包保存的是整个变量对象, 而不是某个特殊的变量**.
2.  只要没有形成闭包, 当函数执行完毕, 就可以立即销毁其作用域链和活动对象(变量对象).
3.  如果形成闭包, 作用域链也会被销毁, 但是**活动对象及变量对象不会销毁**.
4.  作用域链决定哪些数据能被函数访问

### 6. 下面函数返回的是什么, 为什么?

```js
var name = "The Window";
var object = {
  name: "My Object",
  getNameFunc: function() {
    return function() {
      // this只有执行时在确定指向谁, 当前this指定window
      // 活动对象中只有window
      return this.name;
    };
  }
};
console.log(object.getNameFunc()()); // The Window
```

匿名函数的执行环境具有全局性, 因此其`this`对象通常指向`window`(这里可以使用`call/apply`主动改变 this).

> this 的概念: 在函数运行时，基于调用位置的条件自动生成的内部对象，可以理解为动态绑定对象到 this 上。

每个函数在被调用时都会自动取得两个特殊的变量: `this`和`arguments`. 内部函数在搜索这两个变量时, 只会搜索到其活动变量为止, 因此最后一个函数执行时, 外层 function 的活动对象只有 window, this 为 window, 即, `this === window`.

因此, **函数执行时才能确定 this**, 且**this 指向调用函数最近的一个对象**.

### 7. IIFE 能模仿块级作用域的原因?

JavaScript 是函数级作用域, 在立即执行函数内定义的变量是局部变量, 一般情况下, 使用完毕后会自动销毁.

### 8. 关于作用域链优化部分的理解?

- 缓存深层作用域链上的变量

变量使用前都会在作用域链中查找, 因此**将常用的跨作用域变量缓存为局部变量能减少变量查找时间**

- 避免使用 with

with 能动态改变作用域链, **将指定的对象压入作用域链顶端**, 造成原来局部变量对象转为第二位, 影响查找效率.

- catch 内部使用简化代码

当 try 代码中发生错误时, 执行过程会自动跳转到 catch 中, 然后**把异常对象推入一个变量对象并置于作用域的首位**, 建议 catch 中不要放复杂的语句

- 尽量不使用 eval()

      	- 非严格模式下, eval中的语句只有在执行时才知道是否有内部变量**污染外部环境**;
      	- 严格模式为eval中的变量为局部作用域
      	- 此外, **js引擎无法对动态作用域进行优化**, 只能按照作用域链查找的传统模式进行执行.
