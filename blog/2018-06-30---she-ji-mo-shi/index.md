---
title: 设计模式
author: 烈风裘
date: 2018-06-30T02:51:25.650Z
draft: true
comments: true
star: false
cover: ''
tags: 
  - 设计模式
---

基础代码写到一定程度就会不断的朝着一系列特定的设计模式迁移，即使这种模式在以往未有经验习得，但是在不断的摸索中也会有所感知。是的，这种模式已经被总结归纳出来，就是代码编码的设计模式。

设计模式是一种能够抽象，能将特定的现实问题通过特定的设计模式解决。就好比在 JavaScript 中处理数据时，使用 Lodash 或者 Underscore 提供的函数就比自己实现一个好很多，关键一点是容错及性能、再加上代码阅读难易程度上。

> 设计模式是代码编写的高级语言，就好比成语相对于汉语的关系。这是《刻意联系》一书中所说的高级心理表征。

这里说下设计模式的特点：

- 可复用的、解决软件设计中的常见问题
- 已被验证、大量使用的解决方案
- 使用模式规范代码，防止产生不必要的小问题（代码一致性的问题，有时候人是靠不住的）
- 设计模式是开发人员的必备技能，通用语言
- 做到代码精简，思路清晰

模式的分类：

- 创建型设计模式（生成对象）
- 结构型设计模式（描述对象间关系）
- 行为设计模式（描述对象间通信方法）

## 创建型设计模式（生成对象）

### Constructor

ES6 中的 class，这个已在实践中大量使用，ES6 的 Class 语法参考这里： [Class 的基本语法](http://es6.ruanyifeng.com/#docs/class)，前一篇博文已有 Constructor 和 Prototype 对比介绍的相关文章：[关于 class](/guan-yu-class/)。

### Module

ES6 中的 Module，这个已在实践中大量使用，内容参考这里：[Module 的语法](http://es6.ruanyifeng.com/#docs/module)。关于 ES6 与 Commonjs 的 Module 区别已在另一篇博文介绍：[关于 Module](/guan-yu-module/)。

### Singleton

一般通过闭包保存私有变量来实现，不一定需要将生成的示例放到全局 window 上（好像是废话）。单例模式的出现表明了系统中的模块耦合紧密，其代码分散在各个模块中。这与模块解耦的思想背道而驰，使用时注意。

### Prototype

> 对于原型模式，我们可以利用 JavaScript 特有的原型继承特性去创建对象的方式，也就是创建的一个对象作为另外一个对象的 prototype 属性值。原型对象本身就是有效地利用了每个构造器创建的对象，例如，如果一个构造函数的原型包含了一个 name 属性（见后面的例子），那通过这个构造函数创建的对象都会有这个属性。

目前这类模式我在工作中直接使用的很少，都是通过 Class+Babel 模式开发。虽然 JS 原生支持这个模式，但是在编程人员自己的思维模型模型中，通过 Class 的模式创建实例比较主流。这部分比较有名的是[Stampit 库](https://www.npmjs.com/package/stampit)，我个人认为这样的非主流技巧用在个人项目中完全没问题，团队合作除非达成共识，建议还是跟随主流使用 Class。

### Factory

工场模式和使用 class 生成示例很像，但是两者在使用场景上是有区别的：

- Factory 模式一般用于构建十分复的杂对象
- 如果生成的实例对象和环境有关，使用 Factory 模式将会更灵活一些
- class 适合于“骨架”对象的定义，可以通过继承来达到**有限的**灵活性

**工厂函数**

```js
var page = page || {};
page.dom = page.dom || {};
//子函数1：处理文本
page.dom.Text = function() {
  this.insert = function(where) {
    var txt = document.createTextNode(this.url);
    where.appendChild(txt);
  };
};

//子函数2：处理链接
page.dom.Link = function() {
  this.insert = function(where) {
    var link = document.createElement("a");
    link.href = this.url;
    link.appendChild(document.createTextNode(this.url));
    where.appendChild(link);
  };
};

//子函数3：处理图片
page.dom.Image = function() {
  this.insert = function(where) {
    var im = document.createElement("img");
    im.src = this.url;
    where.appendChild(im);
  };
};

page.dom.factory = function(type) {
  return new page.dom[type]();
};
```

**使用方法：**

```js
var o = page.dom.factory("Link");
o.url = "http://www.cnblogs.com";
o.insert(document.body);
```

## 结构型设计模式(表述结构与关系)

### Facade 外观模式

使用过 jQuery 的元素选择器就知道了这个模式的具体用法和缺点了。

```js
$(".app").click(() => {});
```

- 对外提供统一接口，隐藏内部实现
- 这种抽象会对性能产生影响，设计时需要评估性能成本

### Decorator 装饰者模式

拓展一个对象我们一般使用类的继承方式进行，而装饰者模式有着比类继承更好的弹性。区别继承模式和装饰着模式的关键是理解：**共性和个性**。

比如使用类的继承可以实现这样的关系：车=车身+发动机+轮子+车窗，这些是共性，具有结构性，可以通过继承完美解决。但是全景天窗+19 寸轮子+车内挂饰等，这些都是个性，使用类继承将需要写很多个性化代码，不利于维护。

- 对象装饰：Object.assign，或者直接`a.newMethod`。
- 类方法的装饰：例如：`@debounce(100)`

```js
import Debounce from "lodash-decorators/debounce";
import Bind from "lodash-decorators/bind";
import { connect } from "dva";

@connect()
export default class Com extends React {
  @Bind()
  @Debounce(200)
  onClickHandler() {}
}
```

### Flyweight 享元模式

这种模式主要是为了避免创建大量相同的东西，比如类、数据、事件绑定函数等。比如实例只有几个参数不同其余完全一致，就可以将那些参数移动到类实例的外面，在方法调用的时候将他们传递进来，就可以通过共享大幅度第减少单个实例的数目。

- 数据层：公共信息提取，单独维护，公共数据的状态通过继承、组合的方式进行拓展。在形式上类似于分型，顶部为公共数据。
- DOM 层：用于 DOM 中则为事件代理模式，即当绑定的事件的子元素很多时，会造成性能问题，且事件处理函数本身基本相同，因此使用父元素代理能解决性能问题。
- 缓存系统

## 行为设计模式（描述对象间通信方式）

### Publish/Subscribe 发布订阅模式

> 它定义了一种一对多的关系，让多个**观察者对象**同时监听一个**主题对象**的状态，当这个**主题对象**的状态发生变化时，就会通知所有**已注册的观察者对象**，**观察者对象**根据主题状态进行后进行自己的逻辑处理。
>
> [深入理解 JavaScript 系列（32）：设计模式之观察者模式](https://www.cnblogs.com/TomXu/archive/2012/03/02/2355128.html)

适用场景：**一个对象的改变需要改变多个其他对象（不确定其他对象数目）**，比如 UI 事件类。因此，观察者模式所做的工作就是解耦，让耦合的双方都依赖于抽象，而不是依赖于具体，从而使得各自的变化都不会影响到另一边的变化。

关于事件订阅发布模型可以参考 Nodejs 的[EventsAPI](https://nodejs.org/api/events.html)，我曾经根据这个 API 写了一个能在浏览器端工作的事件订阅发布库[events](https://github.com/typescript-practice/events)，关键 API 如下：

- emitter.addListener(eventName, listener)
- emitter.emit(eventName[, ...args])
- emitter.on(eventName, listener)
- emitter.once(eventName, listener)
- emitter.off(eventName, listener)

### Observer 观察者模式

> 这里缺一个 UML 图
>
> Vue 双向绑定的实现

待续。

### Mediator 中介者模式

[深入理解 JavaScript 系列（36）：设计模式之中介者模式](https://www.cnblogs.com/TomXu/archive/2012/03/13/2374789.html)

待续。

## 其他

### Command 命令模式

> 在实际项目中已经使用过这个模式，但是不知道原来是 Command 模式

**原始函数：**

```js
$(function() {
  var CarManager = {
    // 请求信息
    requestInfo: function(model, id) {
      return "The information for " + model + " with ID " + id + " is foobar";
    },

    // 购买汽车
    buyVehicle: function(model, id) {
      return "You have successfully purchased Item " + id + ", a " + model;
    },

    // 组织view
    arrangeViewing: function(model, id) {
      return (
        "You have successfully booked a viewing of " +
        model +
        " ( " +
        id +
        " ) "
      );
    }
  };
})();
```

上述函数可能在使用时出现耦合过紧的问题，需要一个中间层抽象，可以这么写：

```js
// 添加方法
CarManager.execute = function(command) {
  return CarManager[command.request](command.model, command.carID);
};
// 使用
CarManager.execute({
  request: "arrangeViewing",
  model: "Ferrari",
  carID: "145523"
});
```

### Mixin 混入模式

(完)
