---
title: 第四章 变量-作用域和内存问题
author: 烈风裘
date: 2018-01-20T07:48:24.259Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

## 问答

### 1. 何为基本类型和引用类型?

基本类型: 简单的数据段, 类型如, undefined, null, boolean, string, number;

引用类型: 值保存在**堆内存**中的对象, 通过地址访问.

### 2. 函数传递参数时, 基础类型是按值传递/引用类型是按引用传递?

回答: **全部是按值传递!!**

当在向参数传递引用类型的值时, 会把这个值在堆内存中的地址复制给一个局部变量. **可以把 ECMAScript 函数的参数想象成局部变量**(这部分结合作用域链/函数执行过程理解)

这两个在函数调用时都是按值传递, 需要指出的是, **引用类型的值是堆内存地址**.

### 3. 作用域链的作用?

保证对执行环境有权访问的所有变量和函数有序访问.

### 4. 类型如何检测?

基本类型可以通过`typeof`判断, 引用类型都会返回`object`. 对于引用类型可以使用`instanceof`来判断.

### 5. JS 的垃圾搜集使用什么策略?

**标记清除**策略, 主流的垃圾搜集算法.

当变量**进入环境**时(比如**在环境中声明一个变量**), 就将这个变量标记为"进入环境". 当变量离开环境时, 将其标记为"离开环境".

此外, 还有**引用计数**, 会引起**循环引用**的问题. 知道就好, 主流浏览器已放弃.

为确保有效的回收内存, 建议及时解除不再使用的全局对象/全局属性.

### 6. 关于函数执行期的 arguments 的问题

```js
function add(num1, num2) {
  arguments[0] = 3;
  arguments[1] = 12;
  var arr = Array.prototype.slice.call(arguments);
  console.log(add.length); // 2, 表示支持两个参数
  console.log(arguments); // [Object Arguments]
  console.log(arguments.length); // 1
  console.log(arr); // [3]
  return num1 + num2; // 3 + undefined
}
add(1); // NaN
```

**说明:**

- ECMAScript 中的函数并不关心传递的是什么参数/几个参数
- 函数参数在内部使用一个 Arguments 对象表示(类似数组), 可通过下标访问各个成员
- 并且 arguments 中的值和对应的命名参数保持一致, 上面的例子中, num1 保持同步一致, num2 因为没在 arguments 中出现, 因此不会同步.
- **arguments 和对应的命名参数在存储上是独立的**, 这部分参考原型链/函数执行过程
