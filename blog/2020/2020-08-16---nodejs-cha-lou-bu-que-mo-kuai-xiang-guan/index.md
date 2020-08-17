---
title: Nodejs查漏补缺-模块相关
author: 烈风裘
date: 2020-08-16T03:48:20.527Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Node
---

### 1 请介绍一下node里的模块是什么？

Node中，每个文件模块都是一个对象，它的接口 ```NodeModule``` 定义如下：

```typescript
interface NodeModule {
    exports: any;
    require: NodeRequireFunction;
    id: string;
    filename: string;
    loaded: boolean;
    parent: NodeModule | null;
    children: NodeModule[];
    paths: string[];
}

interface NodeRequireFunction {
    /* tslint:disable-next-line:callable-types */
    (id: string): any;
}

function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  if (parent && parent.children) {
    parent.children.push(this);
  }

  this.filename = null;
  this.loaded = false;
  this.children = [];
}

module.exports = Module;
```

所有的模块都是 Module 的实例。module.exports 的定义就在这里体现，**默认是空对象**！

这里的module.js引用subModules.js文件，打印module.js中的的 `module` 变量的结果：

```javascript
Module {
  id: '.', // 当前的ID
  path: '/Users/Hsiang/tp/config', // 文件Path
  exports: {}, // 导出的方法
  parent: null,
  filename: '/Users/Hsiang/tp/config/module.js', // 当前模块的文件名
  loaded: false, // 是否加载
  children: [ // 依赖的模块
    Module {
      id: '/Users/Hsiang/tp/config/subModule.js',
      path: '/Users/Hsiang/tp/config',
      exports: [Object],
      parent: [Circular],
      filename: '/Users/Hsiang/tp/config/subModule.js',
      loaded: true,
      children: [],
      paths: [Array]
    }
  ],
  paths: [ // 当前模块寻址Path顺序
    '/Users/Hsiang/tp/config/node_modules',
    '/Users/Hsiang/tp/node_modules',
    '/Users/Hsiang/node_modules',
    '/Users/node_modules',
    '/node_modules'
  ]
}
```



### 2. 我们知道node导出模块有两种方式，一种是 exports.xxx=xxx 和module.exports={} 有什么区别吗

`exports` 其实就是 `module.exports` 的引用，最终使用模块认的是 `module.exports` ，而不是 `exports`；保险起见，直接使用 `module.exports`。



### 3. 加载模块时，为什么每个模块都有exports, require, module, __filename, __dirname属性呢？

在执行模块代码之前，Node.js 会使用一个如下的函数封装器将其封装，模块内部的变量为**函数及作用域**：

```javascript
// /Users/Hsiang/tp/config/module.js
(function(exports, require, module, __filename, __dirname) {
  // 模块的代码实际上在这里
  // __filename === /Users/xx/projectName/src/module.js   绝对路径
  // __dirname === /Users/xx/projectName/src   绝对路径
});
```



### 4. 请介绍一下require的模块加载机制及模块寻找顺序？

require的接口定义如下：

```typescript
interface NodeRequire extends NodeRequireFunction {
    resolve: RequireResolve;
    cache: any;
    extensions: NodeExtensions;
    main: NodeModule | undefined;
}
```

require具体代码执行过程：

```javascript
// require 其实内部调用 Module._load 方法
Module._load = function(request, parent, isMain) {
  //  计算绝对路径
  var filename = Module._resolveFilename(request, parent);

  //  第一步：如果有缓存，取出缓存
  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;

  // 第二步：是否为内置模块
  if (NativeModule.exists(filename)) {
    return NativeModule.require(filename);
  }
  
  /********************************这里注意了**************************/
  // 第三步：生成模块实例，存入缓存
  // 这里的Module就是我们上面的1定义的Module
  var module = new Module(filename, parent);
  Module._cache[filename] = module;

  /********************************这里注意了**************************/
  // 第四步：加载模块
  // 下面的module.load实际上是Module原型上有一个方法叫Module.prototype.load
  try {
    module.load(filename);
    hadException = false;
  } finally {
    if (hadException) {
      delete Module._cache[filename];
    }
  }

  // 第五步：输出模块的exports属性
  return module.exports;
};
```

module.load 这里的寻址方式如下：

1. 如果是Core模块
2. 如果是路径
   1. LOAD_AS_FILE: x.js -> x.json -> x.node
   2. LOAD_AS_DIRECTORY: 
      1. 如果存在 package.json | main 
         1. 构造新位置M -> LOAD_AS_FILE(M) -> LOAD_INDEX(M)
      2. LOAD_INDEX(M): index.js -> index.json -> index.node

3. 其他...



### 5. 如何判断当前JS文件是被引用还是被直接运行？

`require.main` 返回的是 `Module` 对象，表示当 Node.js 进程启动时加载的入口脚本。因此可以通过下面方式判定：

```javascript
if(require.main === module) {
  // 当前文件为node主入口
} else {
  // 当前文件为子模块
}
```



### 6. 循环require模块会发生什么结果？

> 摘抄自Node文档：http://nodejs.cn/api/modules.html

当循环调用 `require()` 时，一个模块可能在未完成执行时被返回。

例如以下情况:

`a.js`:

```js
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');
```

`b.js`:

```js
console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a.done = %j', a.done);
exports.done = true;
console.log('b 结束');
```

`main.js`:

```js
console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);
```

当 `main.js` 加载 `a.js` 时， `a.js` 又加载 `b.js`。 此时， `b.js` 会尝试去加载 `a.js`。 为了防止无限的循环，会返回一个 `a.js` 的 `exports` 对象的 **<mark>未完成的副本（不是一定是空对象）</mark>** 给 `b.js` 模块。 然后 `b.js` 完成加载，并将 `exports` 对象提供给 `a.js` 模块。

当 `main.js` 加载这两个模块时，它们都已经完成加载。 因此，该程序的输出会是：

```console
$ node main.js
main 开始
a 开始
b 开始
在 b 中，a.done = false
b 结束
在 a 中，b.done = true
a 结束
在 main 中，a.done=true，b.done=true
```

需要仔细的规划, 以允许循环模块依赖在应用程序内正常工作.



### 7. 模块缓存，如何解除缓存问题？

问题4中，关于require的工作机制提到了load模块时会存在缓存设计，即被引入的模块将被缓存在 `require.cache`  （等同于 `Module._cache` ）中；另外Module类在初始化时，会在 `parent.children` 中保存子模块的一个引用。根据Nodejs内存回收机制，简单的讲就是当一个对象没有被任何其他对象引用的时候（引用计数模式），这个对象就会被标记为可回收，并在下一次GC处理的时候释放内存。

所以消除模块缓存需要做的处理如下：

```javascript
function cleanCache(modulePath) {
    var module = require.cache[modulePath]; 
    // 1. remove reference in module.parent
    if (module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    // 2. 去除本身cache的引用（require.cache === module._cache）
    require.cache[modulePath] = null;
}
```



### 8. 如何找到模块的绝对路径？

**API: require.resolve('./moduleName')**

使用内部的 `require()` 机制查询模块的位置，此操作只返回解析后的文件名，不会加载该模块。

如果找不到模块，则会抛出 `MODULE_NOT_FOUND` 错误。



### 9. mjs解释下

 `.mjs` 扩展名是保留给 [ECMAScript 模块](http://nodejs.cn/s/iyYkEg)，无法通过 `require()` 加载。目前处于实现性质阶段，不建议 `import` 和 `require` 混用；

