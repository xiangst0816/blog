---
title: 第五章 引用类型
author: 烈风裘
date: 2018-01-21T02:13:24.650Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

### 1. 下面代码返回什么, 位置 3~98 返回什么?

```js
var colors = ["red", "green", "blue"];
colors[99] = "black";
console.log(colors.length); // 100 3~98返回undefined
```

```js
var colors = ["red", "green", "blue"];
colors.length = 2;
console.log(colors); // ["red", "green"]
colors.length = 3;
console.log(colors); // ["red", "green", undefined]
colors[4] = "hello";
console.log(colors); // ["red", "green", undefined, undefined, 'hello']
console.log(colors.length); // 5
```

**说明:**

- array 类型的 length 属性不是只读的, 设置 length 可以对数组**动态**缩减及扩容.
- 可根据需要动态添加数据, **length 自动叠加**, 中间未定义的数据为 undefined

### 2. 数组复制的方法有哪些?

```js
var arrs = [1, 2, 3, 4, 5, 6];
console.log([].concat(arrs));
console.log(arrs.slice());
console.log(arrs.map(item => item));
console.log(JSON.parse(JSON.stringify(arrs)));

arrs.push("test");
console.log(arrs);
```

### 3. 不影响原值的情况下, 获取数组最后一个元素的方法有哪些?

```js
var arrs = [1, 2, 3, 4, 5, 6];
console.log(arrs.slice(-1)[0]); // 6
console.log(arrs[arrs.length - 1]); // 6
console.log([].concat(arrs).pop()); // 6
console.log(arrs.slice().splice(arrs.length - 1, 1)[0]); // 6
console.log(arrs); // [1, 2, 3, 4, 5, 6]
```

### 4. 理解 Function, 实现`Object.create()`方法的 polyfill?

**函数名仅仅是指向函数的指针, 或者说, 是一个包含指针的变量而已!!!!**.

这里, `Object.create(proto[, propertiesObject])`表示使用指定的原型对象和属性去创建一个新的对象, 返回在原型对象上添加了指定属性的新对象(是在返回的对象的原型上加属性)

```js
if (typeof Object.create !== "function") {
  Object.create = function(proto, properitiesObject) {
    if (typeof proto !== "object" || typeof proto !== "function") {
      throw new TypeError('Object.create 方法的第一参数必须是对象或者函数!')
    }else if(proto === null)){
      throw new Error('浏览器未实现Object.create方法, 当前polyfill不支持第一个参数传null!')
    }
    if(typeof properitiesObject !== 'undefined')){
      throw new Error('浏览器未实现Object.create方法, 当前polyfill不支持第二个参数!')
    }

    function F (){}
    F.prototype = proto;
    return new F();
  };
}
```

### 5. 下面语句返回什么

```js
function add(num) {
  return num + 100;
}

var storeAdd = add;

function add(num) {
  return num + 200;
}

add(100); // 300
storeAdd(200); // 400 第一个add函数被覆盖, 参考: 作用域链/函数内参数优先级/变量提升等
```

### 6. 如何理解函数传参是按值传递的?

**答**: 引用类型传递的是**堆内存地址**, 因此改变地址变更不会影响原来堆内存状态. 但是通过地址修改堆内存中的数据是会生效的.

### 7. 举例函数的内部属性/属性/方法有哪些及定义和作用?

**函数内部属性:**

- `arguments`: 是一个类数组对象, 包含着传入函数中的所有参数(**实际传参**), 可通过`[].slice.call(arguments, 0)`转化为数组.
- `arguments.callee`: 指向拥有这个 arguments 对象的函数
- `arguments.callee.caller`: 这个属性保存着调用当前函数的函数引用, **如果是全局调用则为 null**
- `this`: 引用的是函数执行期间的**环境对象**, 全局环境则为 window, 或者说, this 值的指向**取决于方法在那个对象上执行**.

**函数属性**:

- `length`: 表示函数**希望接收到**的函数参数的个数, 形参个数
- `prototype`: 保存所有**实例方法**的位置. 创建自定义引用类型和继承, 不可枚举

**函数方法**:

- `apply()和call()`: 设置函数内部的 this 对象的值. 用于在**特定环境对象**中调用函数, 扩充作用域, 解耦. 传参说明:
  - `apply([thisObj [,argArray] ]);`
  - `call([thisObject[,arg1 [,arg2 [,...,argn]]]]);`
- `bing()`: IE9+, 创建一个**指定环境对象**的函数实例.
- `toLocalString():` 返回函数代码(str)
- `toString()`: 返回函数代码(str)
- `valueOf()`: 返回函数引用

### 8. IE6/7/8 没有`bind()`实现方法, 你做一个 polyfill 吧?

```js
function bind(fn, obj) {
  if (fn.bind) {
    return fn.bind(obj);
  } else {
    return fn.apply(obj, arguments);
  }
}
```

### 8. 如何理解基础类型, 例如: Number/Boolean/String 会有类似对象的`.`操作方式?

例如:

```js
var s1 = "some string";
var s2 = s1.substring(2);
```

**说明**:

基础类型在**读取**时都会在后台有特殊处理而转化为对象, 例如:

```js
var s1 = "some string";
var _s1 = new String("some string"); // 后台转化
var s2 = _s1.substring(2);
_s1 = null; // 清理
```

**包装类型**, Number/Boolean/String, 只会存在于一行代码执行的瞬间, 然后立即被销毁. 以上, **使得基本类型值可以当做对象访问**.

### 9. 写书下面代码的输出值?

```js
var string = "hello world";
console.log(string.slice(3)); // 结果: 'lo world'
console.log(string.substring(3)); // 结果: 'lo world'
console.log(string.substr(3)); // 结果: 'lo world'

console.log(string.slice(3, 7)); // 结果: 'lo w'
console.log(string.substring(3, 7)); // 结果: 'lo w'
console.log(string.substr(3, 7)); // 结果: 'lo worl'

console.log(string.slice(-3)); // 结果: 'rld' 解释: string.slice(8)
console.log(string.substring(-3)); // 结果: 'hello world' 解释: string.substring(0)
console.log(string.substr(-3)); // 结果: 'rld' 解释: string.substr(8)

console.log(string.slice(-3, -7)); // 结果: '' 解释: 不存在自动转化 string.slice(8, 4)
console.log(string.substring(-3, -7)); // '' 解释: 负数全部转为0 string.substring(0, 0)
console.log(string.substr(-3, -7)); // '' 解释: string.substring(8, 0)

console.log(string.slice(3, -7)); // 结果: 'l' 解释: string.slice(3, 4)
console.log(string.substring(3, -7)); // 'hel' 解释: 存在大小数自动转化 string.substring(3, 0) -> string.substring(0, 3)
console.log(string.substr(3, -7)); // '' 解释: string.substring(3, 0)
```

### 10. 函数的类型是对象?

YES. 函数实际上是`Function`的实例, 因此也是对象.

### 11. 下面类型检查返回什么?

```js
console.log(typeof undefined); // undefined
console.log(typeof null); // object
console.log(typeof []); // object
console.log(typeof function() {}); // function

(function() {
  console.log(typeof arguments); // object
})();

var a = function b() {};
console.log(typeof b); // undefined 函数名b不能再外部引用,
```

说明:

- `arguments`是类数组**对象**
- 函数表达式不存在变量提升的情况, 因此`b`不会再外部成为能访问的变量
- 但是`b`能在`b`函数内访问是因为函数内是能访问**函数名**的, 这里函数名就是`b`

### 12. 对象的 delete 操作符的使用?

```js
(function(x) {
  delete x;
  return x; //1
})(1);
```

**说明**

- delete**只能删除对象上的属性**, 对其他变量或者函数名无效
- delete 是不会直接释放内存, 而是**中断对象引用**(?)

### 13. 下列`typeof`的使用的返回值?

```js
// 逗号操作符的求值顺序, 返回最后一个操作对象的值
var f = (function f() {
  return "1";
},
function g() {
  return 2;
})(); // 2
typeof f; //"number"
```

```js
// typeof 返回的是string类型
typeof typeof x; // string
```

```js
// 表达式的执行顺序考察, 变量提升(脑海中要有这个过程)
var y = 1,
  x = (y = typeof x);
x; //"undefined"

// 转化为
var y = 1;
var x = undefined;
y = typeof x; // undefined
x = y; // undefined
x; // undefined
```

### 14. 下列`instanceof`的使用的返回值?

只要测试的构造函数在实例的原型链中出现过, 结果就会返回 true.

```js
function SuperType() {
  this.property = true;
}

SuperType.prototype.getSuperValue = function() {
  return this.property;
};

function SubType() {
  this.subproperty = false;
}

//继承了 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function() {
  return this.subproperty;
};

var instance = new SubType();

console.log(instance instanceof Object); //true
console.log(instance instanceof SubType); //true
console.log(instance instanceof SuperType); //true
```
