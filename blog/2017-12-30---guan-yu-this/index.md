---
title: 关于this
author: 烈风裘
date: 2017-12-30T14:02:09.209Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JavaScript
---

## this 是什么

**在函数运行时，基于调用位置的条件自动生成的内部对象**，可以理解为动态绑定对象到 this 上。

需要强调的是：

- 只针对函数，**在函数内部使用**
- this 由调用位置的上下文**自动的**决定，而不是函数声明的位置（代码书写的位置）
- 必须是运行时才确定，而不是编写时
- this 绑定之后可理解为**自动生成的内部对象**

示例：

```js
var foo = "golbal foo";
var myObj = { foo: "myObj foo" };
var say = function() {
  console.log(this.foo);
};

myObj.say = say;
myObj.say(); //结果：myObj foo
say(); //结果：golbal foo  ，相当于window.say()，内部的this->window对象
```

## this 的四个绑定规则及优先级

下面四个为 this 的绑定优先级规则，第一个优先级最高。判断执行流程需要做的就是找到函数的调用位置并判断使用哪条规则。

### 1. 函数是否通过`new Base()`方式绑定？如果是，`this`绑定新创建的对象

在 Javascript 引擎中看到的对象模型是：

![](http://coolshell.cn/wp-content/uploads/2012/02/joo_3.png)

`new`的调用会自动执行下面代码（示例代码），Base 函数中的`this`指向新创建的对象(一般)：

```js
var obj = new Base();

// 1. 创建（或者说构造）一个全新的对象；
var _obj = {};

// 2. 我们将这个空对象的__proto__成员指向了Base函数对象prototype成员对象
_obj.__proto__ = Base.prototype;

// 3. 我们将Base函数对象的this指针替换成_obj，然后再调用Base函数
var _return = Base.call(_obj);

// 4 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象
if (typeof _return === "object") {
  obj = _return;
} else {
  obj = _obj;
}
```

### 2. 函数是否通过`call`、`apply`、`bind`显式绑定？如果是，`this`绑定所指定的对象

强制将`foo`方法中的`this`绑定到`obj`对象上，即使后面再次更新绑定也不生效。

```js
function foo() {
  console.log(this.a);
}
var obj = { a: 2 };
var bar = function() {
  foo.call(obj);
};
bar(); //2
setTimeout(bar, 1000); //2
bar.call(window); //2
```

**注意：**

`bind`绑定会返回新函数，对新函数无法更改内部的 this，原因同上。但是对原函数可以随意切换绑定。

```js
function base() {
  console.log(this.hello);
}
var a = {
  hello: "aaa"
};
var b = {
  hello: "bbb"
};

base.call(a); // aaa
base.call(b); // bbb
var bb = base.bind(b); // 强绑定，返回的bb函数已无法更改this
bb.call(a); // bbb
bb.call(b); // bbb
base.call(a); // aaa
base.call(b); // bbb
```

### 3. 函数是否在某个上下文对象中隐式调用？如果是，`this`绑定到那个上下文对象

```js
function foo() {
  console.log(this.a);
}
var obj1 = {
  a: 2,
  foo: foo
};
var obj2 = {
  a: 1,
  obj1: obj1
};
obj2.obj1.foo(); //结果：2
```

`foo()`执行时的上下文是`obj1`，因此函数内的`this`->`obj1`

**注意：**

隐式绑定会出现绑定丢失的问题，不过这个很好推理。

```js
var a = "foo";
function foo() {
  console.log(this.a);
}
function doFoo(fn) {
  //var fn = obj.foo
  fn();
}
var obj = {
  a: 2,
  foo: foo
};
doFoo(obj.foo); //"foo"  this->window

var bar = obj.foo;
bar(); // "foo" 相当于：window.bar()， this->window
bar.call(obj); // "2" this->obj

setTimeout(obj.foo, 100); //"foo"
```

### 4. 上述全部不是，则`this->window上`，如果是严格模式，`this->undefined`

```js
// 严格模式是？
var a = function() {
  "use strict";
  //...
};
```

## 事件中的 this

### 1. 作为 DOM 事件处理

在事件处理函数中的 this 指向绑定事件的对象`event.currentTarget`

```js
document.getElementById("button").addEventListener("click", function(event) {
  console.log(this);
  console.log(event.target === event.currentTarget);
  console.log(event.target === this);
});
```

> currentTarget：绑定事件的元素，恒等于 this  
> target：触发事件的元素，可能是绑定事件元素的子元素接收到了事件

### 2. 作为内联事件处理

当代码在元素上进行调用处理，this 指向的是这个 DOM 元素，`this->$(button)`

```html
<button onclick="alert(this.tagName.toLowerCase());"> Show this</button>
```

function 函数中返回，则 this 指向 window，`this->window`

```html
<button onclick="alert((function(){return this}()));">Show inner this</button>
```

## IIFE 中的 this

**不管 IIFE 写在哪，里面的 this 都指向 window。**相当于是在 window 下执行 IIFE 函数。此外，自执行函数返回值为 undefined。

## 注意点

### 1. 忽略 this

把`null`或`undefined`作为`this`的绑定对象传入`call`、`apply`、`bind`，调用时会被忽略，实际应用的是默认绑定规则`this->window`！如果是严格模式, 这个值为`undefined`.

```js
function foo() {
  console.log(this.a);
}
var a = 1;
foo.call(null, 2); // 1  this->window
foo.apply(undefined, [3]); //1  this->window
foo.apply(window, [3]); //1  this->window
```

### 2. 间接引用

```js
function foo() {
  console.log(this.a);
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); //3
(p.foo = o.foo)(); //2 间接引用, 前面返回foo函数，相当于：(foo)(), this->window
var pfoo = o.foo;
pfoo(); //2 隐式丢失
```

### 3. 箭头函数

箭头函数中的 this 无法被修改，**this 指向由外层函数决定**，常用于事件处理器或定时器等**异步场景**。

```js
function foo() {
  setTimeout(() => {
    console.log(this.a);
  }, 100);
}
var obj = { a: 2 };
foo.call(obj);
```

等价于：

```js
function foo() {
  var self = this;
  setTimeout(function() {
    console.log(self.a);
  }, 100);
}
var obj = { a: 2 };
foo.call(obj);
```

## 补充

### 1. `bind()`实现？

```js
function bind(f, o) {
  if (f.bind) {
    return f.bind(o);
  } else {
    return function() {
      return f.apply(o, arguments);
    };
  }
}
```

### 2. 什么是严格模式？

为了向新版 JS 语法过度的模式。

#### 放置位置

> 严格模式编译指示: "use strict"

- 放置在脚本第一行
- 声明在函数体中第一行

```js
var a = function() {
  "use strict";
  //...
};
```

#### 与非严格模式的区别

- 无法创建全局变量，变量必须使用 var 声明

```js
"use strict";
var a = 123;
console.log(a);
console.log(a === window.a);
```

- 静默失败都会抛出错误
- 禁止使用 with

```js
var obj = {};
obj.a = 1;
obj.b = 2;
with (obj) {
  alert(a + b);
}
```

with 的作用是将 obj 对象中的变量在{}中展开可直接访问，注意这没有影响 window 对象。类似于作用域拼接。

- 严格模式下，eval 内部有自己的作用域
- 默认的 this 指向 undefined，而不是 window，避免 window 变量被污染
- 禁止在函数内部使用 callee、caller、arguments 这些属性
- 对象属性名唯一，函数传参名唯一
- 禁止八进制表示法
- 不允许对 arguments 赋值
- arguments 不在追踪参数的变化
- 不能再非函数的代码块中声明函数

```js
var a = 6;

if (a > 2) {
  function fn() {
    alert("hi");
  }
  fn();
} //报错
```

- 禁止使用保留关键字

## 测试题

### 1. 为什么要使用 this，而不是传参解决问题

- 复用

在不同的对象环境下执行了它们，达到了复用的效果，而不用为了在不同的对象环境下执行而必须针对不同的对象环境写对应的函数了。

- 模拟类

### 2. 基础 call

```js
function identify() {
  return this.name.toUpperCase();
}
function sayHello() {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}
var person1 = {
  name: "Kyle"
};
var person2 = {
  name: "Reader"
};
identify.call(person1); // KYLE
identify.call(person2); // READER
sayHello.call(person1); // Hello, I'm KYLE
sayHello.call(person2); // Hello, I'm READER
```

> 函数在哪里调用才决定了 this 到底引用的是啥

### 3. this 不是指向函数本身

```js
function fn(num) {
  console.log("fn: " + num);
  // count用于记录fn的被调用次数
  this.count++;
}
fn.count = 0;
var i;
for (i = 0; i < 10; i++) {
  if (i > 5) {
    fn(i);
  }
}
// fn: 6
// fn: 7
// fn: 8
// fn: 9

console.log(fn.count); // 0 -- 耶？咋不是4捏？
```

- fn.count 是函数本身的属性，因为函数也是对象
- this.count 是 fn 函数构造器中的变量， 也是全局变量，this->window

### 4. 继承+引用+this

```js
function Parent() {
  this.a = 1;
  this.b = [1, 2, this.a]; // this.a只在函数体内存在，这里相当于设置“默认值”
  this.c = { demo: 5 };
  this.show = function() {
    console.log(this.a, this.b, this.c.demo);
  };
}
function Child() {
  this.a = 2;
  this.change = function() {
    // this中变量就近引用，如果没有就从原型链继续找
    this.b.push(this.a);
    this.a = this.b.length;
    this.c.demo = this.a++;
  };
}
Child.prototype = new Parent();
var parent = new Parent();
var child1 = new Child();
var child2 = new Child();
child1.a = 11;
child2.a = 12;
parent.show(); // 1 [1,2,1] 5
child1.show(); // 11 [1,2,1] 5
child2.show(); // 12 [1,2,1] 5
child1.change(); // a->5, b->[1,2,1,11], c.demo->4，this就近+继承+引用
child2.change(); // a->6, b->[1,2,1,11,12], c.demo->5，this就近+继承+引用
parent.show(); // 1 [1,2,1] 5
child1.show(); // 5 [1,2,1,11,12] 5
child2.show(); // 6 [1,2,1,11,12] 5
```

需要注意的是：

- 继承+引用

```js
child2.__proto__ === child1.__proto__; // true
```
