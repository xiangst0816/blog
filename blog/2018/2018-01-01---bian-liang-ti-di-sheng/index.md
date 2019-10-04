---
title: 变量提升
author: 烈风裘
date: 2018-01-01T07:01:14.108Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JavaScript
---

> 这里说的变量提升指的是使用**var**声明的变量

变量提升也可以说是“**变量声明前置**”，就是把函数里面用到的变量声明提升到前面，**赋值步骤在书写的位置进行**。

## 是否使用 var 定义变量的区别

```js
function foo() {
  var a = "var-a";
  b = "var-b";
}

foo();
console.log(b); // 'var-b'
console.log(a); // ReferenceError: a is not defined
```

- 使用 var 定义的变量是函数级变量，只在函数内能访问到。
- 不使用 var 定义的变量是全局变量，等同于`window.b = 'var-b'`

## 块级作用域和函数级作用域

- 使用传统的`var`定义的变量执行的是**函数级作用域**。

描述一下就是：在函数中使用`var`定义的变量都会将变量声明放在函数的第一行，变量赋值在书写的位置赋值。

- 使用 let 定义变量将执行**块级作用域**，即`{}`内范围

```js
function test() {
  var varvars = "varvars";
  let letvars = "letvars";

  if (true) {
    var varvars = "11";
    let letvars = "22";
  }

  console.log("test varvars:" + varvars);
  console.log("test letvars:" + letvars);
}

test();
```

等同于：

```js
function test() {
  var varvars = undefined;
  let letvars = "letvars";

  varvars = "varvars";

  if (true) {
    varvars = "11";
    let letvars = "22";
  }

  console.log("test varvars:" + varvars); // 1
  console.log("test letvars:" + letvars); // letvars
}

test();
```

## 结合函数执行过程说明

当程序进入执行的上下文（代码真正执行之前），变量对象（VO）已经包含的属性是：

- 函数的所有**形参**

创建由**变量名称**和**对应值**组成的一个变量对象，如果名称没有对应的值时，默认值为 undefined

- 所有**函数声明**

创建由**函数名**和**函数对象**组成的一个变量对象，如果函数名已存在则完全替换

- 所有**变量声明**（var 声明）

创建由**名称**和**对应值**组成的一个变量对象，如果名称没有对应的值时，默认值为 undefined
，如果函数名已存在则完全替换

## 示例及优先级说明

```js
function test(name) {
  var name = undefined; // 这里的定义将覆盖形参name和函数name, 声明提升，默认为undefined
  function name() {
    // 这里定义的name函数将覆盖形参name
    console.log("hello");
  }

  name = "inner"; // 这里的定义将覆盖形参name和函数name
  console.log(name); // 输出 inner
}

test("outer");
```

或者：

```js
function test(name) {
  // 1. 形参: {name: 'outer'}
  // 2. 函数: {name: function () { // ... }} 覆盖上面的同名定义
  // 3. 变量: {name: 'inner'} 覆盖上面的同名定义，多个var赋值取最后一次赋值

  var name = "inner"; // 这里的定义将覆盖形参name和函数name, 声明提升，这里的定义将覆盖形参name和函数name
  function name() {
    // 这里定义的name函数将覆盖形参name
    console.log("hello");
  }

  console.log(name); // 输出 inner
}

test("outer");
```

注意：

- 不管 var 声明放在何处，结果都是一样的
- 多次 var 声明同一个变量，代码不会报错，声明前置，原地赋值
- 如果使用 let 声明，则**不可定义已存在的变量名（包括 函数名和形参）**， 返回错误

```js
SyntaxError: Identifier 'name' has already been declared
```

## 总结

- *var 定义的变量*为**函数级作用域**
- *var 定义的变量*会有**变量声明提升**的现象，但是在**书写位置赋值**
- *let 定义的变量*为**块级作用域**，不会出现变量声明提升的现象，在书写的位置声明及赋值，变量名称不能和 [形参名称/函数名称] 重复。
- 生效优先级：`变量名(var定义) > 函数名 > 形参名`
- let 不会出现同名的问题，但是`函数名 > 形参名`的情况会存在
