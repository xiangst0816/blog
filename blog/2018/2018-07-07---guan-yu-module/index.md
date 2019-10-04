---
title: 关于Module
author: 烈风裘
date: 2018-07-07T01:58:56.117Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - 设计模式
---

CommonJS 和 AMD 模块都只能**在运行时**才能确定模块导出的**对象**。因此运行时才能得到整个对象，也就无法做到静态优化。而 ES6 从语法层面支持模块功能，其设计初衷就是就是尽量的静态化，使得代码在编译时就能确定模块的依赖关系。

ES6 关于 Module 的介绍参考阮一峰的 ES6 教程：[ECMAScript 6 入门-Module 的语法](http://es6.ruanyifeng.com/#docs/module)。下面是平时用到比较少的部分，使用时应该注意的地方。

## ES6 模块使用时的注意点

- 模块转发时，当前模块不能使用转发的变量

```typescript
export { foo, bar } from "my_module";
console.log(foo); // error
```

- default 本质上就是输出一个叫 default 的变量或方法，然后系统允许你为他任意取名

```typescript
export { add as default };
// 等同于
export default add;
```

```typescript
import { default as foo } from "modules";
// 等同于
import foo from "modules";
```

## 浏览器加载 ES6 模块时的注意点

- defer 和 async 的区别：`defer`是“渲染完再执行”，保证顺序；`async`是“下载完就执行”，不保证顺序。
- `type="module"`时，默认为 defer 模式

```html
<script type="module" src="./foo.js"></script>
<!-- 等同于 -->
<script type="module" src="./foo.js" defer></script>
```

## ES6 模块与 CommonJS 模块的差异

在整理 JavaScript 中 Module 相关的知识点时，不得不提 CommonJS 与 ES6 的 import/export 之间的关系。最主要的提点如下，其余部分都是从这两点的引申，所以不再重复。

- CommonJS 模块输出的是一个**值的拷贝**，ES6 模块输出的是值的**引用**。
- CommonJS 模块是**运行时加载**，ES6 模块是**编译时**输出接口。

## CommonJS 中在`module.exports`和`exports`的区别？

Nodejs[文档说明](http://nodejs.cn/api/modules.html#modules_exports_shortcut)已解释了两者的区别，总的来说就五点：

1.  module.exports 初始值为一个空对象 {}
2.  exports 表示别名， 默认是指向 module.exports 的引用
3.  如果新值赋值给 exports，那他就不再指向 module.exports
4.  require() 返回的是 module.exports 而不是 exports
5.  如果两者产生困惑，那就忽视 exports，直接使用 module.exports

> module.exports: 我才是老大！exports 只是我的昵称。

保险起见，可以这样使用：

```js
module.exports = exports = function Constructor() {
  // code here
};
```
