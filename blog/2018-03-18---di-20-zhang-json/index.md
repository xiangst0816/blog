---
title: 第二十章 JSON
author: 烈风裘
date: 2018-03-18T05:44:57.586Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

### 1. JSON 和 JavaScript 的关系?

- JSON 并不从属于 JavaScript
- JSON 是一种数据格式, 而不是编程语言
- JSON 可表示的数据类型有: 对象/数组/字符串/数字/布尔值/null, 其余类型忽略.

### 2. 除了使用全局对象`JSON`解析 JSON 还有什么方法? 问题点是?

还有`eval()`方法可以解析, 问题点是:

- `eval()`中可能有恶意代码
- 性能不高

> 支持`JSON`的的浏览器, IE8+

### 3. `JSON.stringify(obj)`时的注意点?

- **不能保存函数**, 如果有函数会忽略
- 值为**`undefined`**会被忽略

### 4. 解释下执行`JSON.stringify`这个函数发生的内部流程?

```js
var a = {
  str: "string",
  num: 10,
  fn: function fn() {
    console.log("num:", this.num);
  },
  trans: {
    toJSON: function() {
      return "hello";
    }
  },
  arr: [1, 2, 3, 4, 5]
};
console.log(JSON.stringify(a, null, 2));
```

```json
{
  "str": "string",
  "num": 10,
  "trans": "hello",
  "arr": [1, 2, 3, 4, 5]
}
```

**流程**

1.  如果对象中存在 toJSON 方法, 则执行他获得有效值. 否则返回对象本身. (上面例子最外层对象没有)
2.  如果提供了第二个参数, 则执行过滤操作. **传入函数过滤器的(key, value)是第一步返回的值**
3.  先从最外层对象开始, 如果内层遍历到对象, 则转到 1)
4.  对第 2)返回的每个值进行序列化
5.  如果提供了第三个参数, 则进行对应格式化

> 注意:
>
> 1.  可以控制整个对象的 toJSON 之外, 还可以控制某个属性的 toJSON.
> 2.  第三个参数是格式化参数, 可以是字符串用于填充间隙

### 5. `JSON.parse`中的还原函数?

```js
var book = {
  title: "Professional JavaScript",
  authors: ["Nicholas C. Zakas"],
  edition: 3,
  year: 2011,
  releaseDate: new Date(2011, 11, 1)
};

var a = JSON.stringify(book);

console.log(
  JSON.parse(a, function(key, value) {
    if (key === "releaseDate") {
      return new Date(value);
    }
    return value;
  })
);
```

- `JSON.stringify`时, `Date`本身有自己的`toJSON`方法
- `JSON.parse`时, 是不会有上面的逆过程, 需要手动操作, 因为, string 类型的值不知道之前发生了什么...
- `JSON.parse`第二个参数成为: 还原函数, 函数传参和`JSON.stringify`的过滤函数一致(和`array.prototype.filter`过滤函数的机制不一样, 需注意)
