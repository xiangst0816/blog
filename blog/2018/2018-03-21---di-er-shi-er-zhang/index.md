---
title: 第二十二章 高级技巧
author: 烈风裘
date: 2018-03-21T12:14:54.715Z
draft: false
comments: true
star: false
cover: ''
tags:
  - JS高程
---

### 1. 类型检测的方式有哪些, 使用场景是?

- 使用 typeof 检测基础类型
- 使用 instanceof 检测引用类型
- 使用 Object.prototype.toString.call(value)可以处理大部分情况

### 2. 如果类没有用`new`关键字初始化一般会造成什么后果, 怎么避免?

在构造函数中的属性会污染全局变量`window`, 可以在构造函数中通过`instanceof`判断下当前实例的构造函数是不是自己, 如果不是则使用`new`方法返回.

```js
function Person(name, age, job) {
  if (this instanceof Person) {
    this.name = name;
    this.age = age;
    this.job = job;
  } else {
    return new Person(name, age, job);
  }
}
```

### 3. 补充一个完整类继承及实例化的示例?

```js
// 1. 父类定义
function SuperType(name) {
  if (this instanceof SuperType) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
  } else {
    return new SuperType(name);
  }
}

SuperType.prototype.sayName = function() {
  console.log(this.name);
};

// 2. 子类定义
function SubType(name, age) {
  if (this instanceof SubType) {
    // 2.1 继承了 SuperType 构造函数中定义的属性
    SuperType.call(this, name);
    // 2.2 子类自己的属性
    this.age = age;
  } else {
    return new SubType(name, age);
  }
}

// 父类原型链复制
SubType.prototype = Object.create(SuperType.prototype);
// 因为使用“.prototype =...”后,constructor会改变为“=...”的那个
// constructor，所以要重新指定.constructor 为自身。
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
  console.log(this.age);
};
```

**补充 Object.create 的 polyfill:**

```js
(function () {
    if(typeof Object.prototype.create === 'undefined') {
        Object.prototype.create = function (proto) {
            function F () {}
            F.prototype = proto
            return new F()
        }
    }
})()
}
```

### 4. 讲一个惰性函数的实例场景, 优缺点?

- 优点: 避免不必要分支执行
- 缺点: 运行第一次牺牲点性能
- 适用于初次运行就能确定分支方向的场景, 比如能力判断/平台判断等

**两种写法:**

```js
function doSomething() {
  if (xx1) {
    doSomething = function() {};
  } else {
    doSomething = function() {};
  }
  return doSomething();
}
```

```js
var doSomething = (function() {
  if (xx1) {
    return function() {};
  } else {
    return function() {};
  }
})();
```

### 5. `bind()`函数使用场景及优缺点?

支持原生`bind()`函数的浏览器有: IE9+/Firefox4+/Chrome 等, 其他浏览器需要 Polyfill:

```js
(function() {
  if (typeof Function.prototype.bind === "undefined") {
    Function.prototype.bind = function(obj) {
      const _self = this;
      return function() {
        return _self.apply(obj, arguments);
      };
    };
  }
})();
```

- `bind()`函数固定了执行环境, 对于异步环境保持`this`指向有很大帮助
- 类似于: `setTimeout`/`setInterval`/事件绑定等
- 与普通函数相比会使用更多开销和内存, 使用时注意

### 6. 如何理解函数柯里化?

函数柯里化：用于创建一个已经设置好一个或多个参数的函数。简单的说，对函数的一次分装，简化操作的方式。这个过程需要创建一个闭包，指定某个入参后返回新函数。

这个过程可能会用到：`call`、`apply`、`Array.prototype.slice.call(arguments, n)`、`bind`等函数。

### 7. 在编写库时, 如何防止核心对象被意外修改?

根据对象防篡改等级, 可以分为以下几种:

#### 第一级: **不可扩展对象`Object.preventExtensions(obj)`**

- 不可再添加属性和方法
- 已有属性和方法不受影响
- 通过`Object.isExtensible(obj)`判断是否可拓展

```js
var person = { name: "Nicholas" };
Object.preventExtensions(person);

person.age = 29;
alert(person.age); //undefined
```

#### 第二级: **密封对象`Object.seal(obj)`**

- 继承上一级
- 已有成员不可删除, 但属性值可修改
- 通过`Object.isSealed(obj)`判断是否被密封

```js
var person = { name: "Nicholas" };
Object.seal(person);

person.age = 29;
alert(person.age); //undefined

delete person.name;
alert(person.name); //"Nicholas"
```

#### 第三级: **冻结对象`Object.freeze(obj)`**

- 继承上两级
- 以后成员不可修改
- 如果要修改需要重新定义`[[set]]`函数
- 通过`Object.isFrozen(obj)`判断是否被冻结

#### 函数设计的意义

对 JavaScript 库的作者而言，冻结对象是很有用的。因为 JavaScript 库最怕有人意外（或有意）地修 改了库中的核心对象。冻结（或密封）主要的库对象能够防止这些问题的发生。

### 8. JavaScript 的定时器相关点

- JavaScript 运行在**单线程**环境中, 某个时刻只有一个代码在执行.
- 异步代码会被推入独立的**异步队列(Tasks)**
- 在 JavaScript 中**代码不会立刻执行**的，但**一旦进程空闲则尽快执行**
- 浏览器在这个过程中只负责排序调度, 指派某段代码在某个时间点运行的优先级.
- 定时器队列是一个特殊的队列, 当定时的时间到了, 就将代码插入异步队列
- 定时器中设定的时间**表示何时将定时器的代码添加到异步队列**, 而不是何时执行代码
- 队列中的所有代码都要**等到 JavaScript 进程空闲后才能执行**, 而不管他们是如何添加到队列中
- 即使执行完一个异步代码(Tasks）, **也会有一个很短的时间间隔**, 用于处理页面上的其他事情(UI 更新), 防止页面锁定

### 9. 每个 Tasks 异步都是紧挨着立即执行吗?

不是, 中间会有段时间间隔以便 UI 等工作，当 JavaScript 主进程空闲时, 才将 Tasks 中的异步代码插入 stack 中。

### 10. 当`setInterval`中的函数处理时间超过设置的间隔会发生什么问题, 怎么避免或修复?

**注意点：**

当在 Tasks 队列中**没有**该定时器的任何其他代码实例时，**才将定时器代码添加到队列中**。这确保**定时器代码被加入到 Tasks 队列中**的**最短时间间隔**为指定的间隔。<mark>这里是加入到 Tasks 队列，不是立即执行。</mark>

因此：

- 某些定时器回调会被**跳过**
- 多个定时器代码**执行之间的间隔**会比预期小

可以使用两个`setTimeout`解决：

```js
setTimeout(function() {
  //处理中
  setTimeout(arguments.callee, interval);
}, interval);
```

### 11. 如果一个 JS 函数执行时间接近 1s, 如何优化执行不会让 UI 卡顿?

- 不必要的**同步部分**放入 setTimeout 中
- 使用问题 10 中的方式处理，间隔时间设为 0

### 12. 函数防抖是如何控制调用执行的次数的?

`clearTimeout`和`setTimeout`的组合使用

### 13. debounce 和 throttle 两个函数的区别?

**debounce**：

防抖函数，多次触发只执行最后一次，保证 ideal 时间。比如 input 联想、window 的 resize 事件。

```js
function debounce(fn, delay, context) {
  fn.timer && clearTimeout(fn.timer);
  fn.timer = setTimeout(function() {
    fn.call(context);
    clearTimeout(fn.timer);
    fn.timer = null;
  }, delay);
  return {
    clear: function() {
      clearTimeout(fn.timer);
      fn.timer = null;
    }
  };
}
```

**需要注意的地方:**

- 计时器 timer 放在要处理的函数上, 因为是引用关系, 下次进入能携带 timer 信息
- 每次执行完毕记得清理 timer 信息, 防止下次调用产生问题
- clear 主要作用是清理定时器

**throttle**：

节流函数，根据时间节奏触发，保证间隔。比如点击事件保证间隔，scroll 时控制在 16.6ms 内执行一次等。

```js
function throttle(fn, delay, context) {
  if (fn.timer) return;
  fn.timer = setTimeout(function() {
    clearTimeout(fn.timer);
    fn.timer = null;
  }, delay);
  fn.call(context);
  return {
    clear: function() {
      clearTimeout(fn.timer);
      fn.timer = null;
    }
  };
}
```

**需要注意的地方:**

- 计时器 timer 放在要处理的函数上, 因为是引用关系, 下次进入能携带 timer 信息
- 每次执行完毕记得清理 timer 信息, 防止下次调用产生问题
- 先设置定时, 再去 call 函数

### 14. 实现一个自定义事件库需要用到哪个设计模式?

观察者模式

### 15. 设计自定义事件库必须具备的功能有哪些?

- 定义一个 hash 对象，key 为事件名，value 为回调函数数组
- 事件包括的方法有：on、off、once、emit
- 参考这个库的设计: [events](https://github.com/typescript-practice/events)

### 16. 简述拖放实现的方式是?

监听 mousedown、mouseup、mousemove 事件然后进行相应处理。

- mousedown：记录拖动元素
- mousemove：对拖动元素修改 style 的 top、left 属性
- mouseup：清理操作
