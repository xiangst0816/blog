---
title: 关于Babel最新使用方式
author: 烈风裘
date: 2017-11-19T08:06:59.327Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Babel
  - JavaScript
---

> 文章总结的时间是 2017/11/20

本文是为了梳理 Babel 配置及使用而整理，因为看过使用 Babel 配置项目和文章，存在项目插件使用混乱、文章各种照搬、插件使用听风是雨、插件升级文章内容不再适用的问题。这里就目前最新使用的配置组合进行整理，涉及的插件包括以下三个：

- @babel/preset-env(^7.0.0-beta.32)
- @babel/preset-stage-x(7.0.0-beta.32), x-0,1,2,3
- @babel/polyfill(^7.0.0-beta.32)

## @babel/preset-env

### 特性

#### 替换之前所有`babel-presets-es20xx`插件

> A Babel preset that compiles ES2015+ down to ES5 by automatically determining the Babel plugins and polyfills you need based on your targeted browser or runtime environments.

也就是说，这是一个能根据运行环境为代码做相应的编译，`@babel/preset-env`的推出是为了解解决个性化输出目标代码的问题，通过`browserslist`语法解析需要支持的目标环境，根据环境将源代码转义到目标代码，可以实现代码精准适配。

此外，**`@babel/preset-env`不包含`state-x`一些列插件**，只支持最新推出版本的 JavaScript 语法（state-4），关于`state-x`后面会介绍。

更进一步说明，请参考[Dr. Axel Rauschmayer](http://2ality.com/2017/02/babel-preset-env.html)的介绍。这个插件对特殊平台的开发有很大帮助，比如：Electron、大屏、移动端(只考虑 webkit)等。

#### 替换`@babel/plugin-transform-runtime`的使用

`@babel/plugin-transform-runtime`插件是为了解决：

- 多个文件重复引用相同 helpers（帮助函数）-> 提取运行时
- 新 API 方法全局污染 -> 局部引入

这个插件推荐在编写 library/module 时使用。当然，以上问题可通过设置`useBuiltIns`搞定。

#### 支持实例方法按需引入

传统方式是手动从`core-js`引入需要的 ES6+特性，

```js
require('core-js/fn/set');
require('core-js/fn/array/from');
require('core-js/fn/array/find-index');
...
...
```

或者一股脑全部引入：

```js
import "@babel/polyfill";
// or
require("@babel/polyfill");
```

同样，以上问题可通过设置`useBuiltIns`搞定。

### 使用说明

默认情况下，`@babel/preset-env`的效果和`@babel/preset-latest`一样，虽然上面的说明有提到 polyfills，但是也需要在配置中设置`useBuiltIns`才会生效。

### 主要配置

#### targets

**设置支持环境**，支持的`key`包括：chrome, opera, edge, firefox, safari, ie, ios, android, node, electron。

例如：

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current",
          "chrome": 52,
          "browsers": ["last 2 versions", "safari 7"]
        }
      }
    ]
  ]
}
```

其中，**`browserslist`可在`package.json`中配置**，这个和设置 CSS 的 Autoprefixer 一致，配置优先级如下：

```text
targets.browsers > package.json/browserslist
```

此外，**`browserslist`的配置满足最大匹配原则**，比如需要同时支持在 IE 8 和 Chrome 55 下运行，则`preset-env`提供所有 IE 8 下需要的插件，即使 Chrome 55 可能不需要。

#### modules

选项用于模块转化规则设置，可选配置包括："amd" | "umd" | "systemjs" | "commonjs" | false, 默认使用 "commonjs"。即，将代码中的 ES6 的`import`转为`require`。

如果你当前的 webpack 构建环境是 2.x/3.x，推荐将`modules`设置为`false`，即交由 Webpack 来处理模块化，通过其 TreeShaking 特性将有效减少打包出来的 JS 文件大小。这部分参考这里的回答：[ECMAScript 6 的模块相比 CommonJS 的 require (...)有什么优点？](https://www.zhihu.com/question/27917401/answer/223309781)

#### useBuiltIns

> A way to apply @babel/preset-env for polyfills (via @babel/polyfill).

可选值包括："usage" | "entry" | false, 默认为 false，表示不对 polyfills 处理，**这个配置是引入 polyfills 的关键**。

##### "useBuiltIns":"usage"

在文件需要的位置单独按需引入，可以保证在每个 bundler 中只引入一份。例如：

**In**

a.js

```js
var a = new Promise();
```

b.js

```js
var b = new Map();
```

**Out (if environment doesn't support it)**

```js
import "core-js/modules/es6.promise";
var a = new Promise();
```

```js
import "core-js/modules/es6.map";
var b = new Map();
```

**Out (if environment supports it)**

```js
var a = new Promise();
var b = new Map();
```

**！！注意！！**

当前模式类似于`@babel/plugin-transform-runtime`，polyfill 局部使用，制造一个沙盒环境，不造成全局污染，但是如上配置后，**`@babel/preset-env`能按需引入新实例方法**，例如：

```js
"foobar".includes("foo");
```

而`@babel/plugin-transform-runtime`不行，需要自行从`core-js`中按需引入。我测试的情况和下面这篇文章所说完全不一致。

> 原文：[https://zhuanlan.zhihu.com/p/29506685](https://zhuanlan.zhihu.com/p/29506685)
>
> 当 useBuiltIns 设置为 usage 时，Babel 会在你使用到 ES2015+ 新特性时，自动添加 babel-polyfill 的引用，并且是 partial 级别的引用。
>
> > 请注意： usage 的行为类似 babel-transform-runtime，不会造成全局污染，**因此也会不会对类似 Array.prototype.includes() 进行 polyfill**。

##### "useBuiltIns":"entry"

在项目入口引入一次（多次引入会报错）

```js
import "@babel/polyfill";
// or
require("@babel/polyfill");
```

插件`@babel/preset-env`会将把`@babel/polyfill`根据实际需求**打散**，只留下必须的，例如：

**In**

```js
import "@babel/polyfill";
```

**Out (different based on environment)**

```js
import "core-js/modules/es6.promise";
import "core-js/modules/es7.string.pad-start";
import "core-js/modules/es7.string.pad-end";
import "core-js/modules/es7.array.includes";
```

> 除了新 API，也可以是实例方法，不过最终包体积比使用`"useBuiltIns":"usage"`大 30kb 左右（因项目而异）。

##### "useBuiltIns": false

不在代码中使用 polyfills，表现形式和`@babel/preset-latest`一样，当使用 ES6+语法及 API 时，在不支持的环境下会报错。

## @babel/preset-stage-x

这里需要说明下 ES 特性支持的提案，不同阶段的提案支持的内容不同，其中`stage-4`阶段提案中的特性将会在未来发布。

关于各个 Stage 的说明参考[这里](http://babeljs.io/docs/plugins#stage-x-experimental-presets)。上面介绍的`@babel/preset-env`或者`@babel/preset-latest`就是下面提到的`stage-4`。

> The TC39 categorizes proposals into the following stages:
>
> - Stage 0 - Strawman: just an idea, possible Babel plugin.
> - Stage 1 - Proposal: this is worth working on.
> - Stage 2 - Draft: initial spec.
> - Stage 3 - Candidate: complete spec and initial browser implementations.
> - Stage 4 - Finished: will be added to the next yearly release.

Stage 的包含顺序是：**左边包含右边全部特性，即 stage-0 包含右边 1 / 2 / 3 的所有插件。**

```
stage-0 > ~1 > ~2 > ~3 > ~4:
```

### 疑问

#### 1. 这个和`@babel/preset-env`的区别

`@babel/preset-env`会根据预设的浏览器兼容列表从`stage-4`选取必须的 plugin，也就是说，不引入别的`stage-x`，`@babel/preset-env`将只支持到`stage-4`。

### 建议

#### 1. 如果是 React 用户，建议配到`@babel/preset-stage-0`

其中的两个插件对于写 JSX 很有帮助。

- transform-do-expressions：if/else 三目运算展开
- transform-function-bind：this 绑定

#### 2. 通常使用建议配到`@babel/preset-stage-2`

插件包括：

- syntax-dynamic-import： 动态 import
- transform-class-properties：用于 class 的属性转化
- transform-object-rest-spread：用来处理 rest spread
- transform-async-generator-functions：用来处理 async 和 await

## @babel/polyfill

这个插件是对[core-js](https://www.npmjs.com/package/core-js)和[regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime)的再次封装，在`@babel/preset-env`中的`useBuiltIns: entry`用到，[代码不多](https://github.com/babel/babel/blob/master/packages/babel-polyfill/src/index.js)。

```js
if (global._babelPolyfill) {
  throw new Error("only one instance of @babel/polyfill is allowed");
}
global._babelPolyfill = true;

import "core-js/shim";
import "regenerator-runtime/runtime";
```

**core-js/shim**

> shim only: Only includes the standard methods.

只包含了纳入标准的**API**及**实例化方法**，例如下列常见的。注意，这里没有 generator/async，如果需要，那就安装插件`@babel/preset-stage-3`（或者 0 / 1 / 2）

```js
...
require('./modules/es6.string.trim');
require('./modules/es6.string.includes');
require('./modules/es7.array.includes');
require('./modules/es6.promise');
...
```

**regenerator-runtime/runtime**

> Standalone runtime for Regenerator-compiled generator and async functions.

主要是给 generator/async 做支持的插件。

## 总结

这里需要理解下三个概念：

- 最新 ES 语法：比如，箭头函数
- 最新 ES API：，比如，Promise
- 最新 ES 实例方法：比如，String.protorype.includes

`@babel/preset-env`默认支持**语法**转化，需要开启`useBuiltIns`配置才能转化**API**和**实例方法**。

此外，不管是写项目还是写 Library/Module，使用`@babel/preset-env`并正确配置就行。多看英文原稿说明，中文总结看看就好，别太当真。

## 参考

- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)
- [@babel/preset-stage-0](https://www.npmjs.com/package/@babel/preset-stage-0)
- [@babel/preset-stage-1](https://www.npmjs.com/package/@babel/preset-stage-1)
- [@babel/preset-stage-2](https://www.npmjs.com/package/@babel/preset-stage-2)
- [@babel/preset-stage-3](https://www.npmjs.com/package/@babel/preset-stage-3)
- [stage 的区别](https://www.cnblogs.com/chris-oil/p/5717544.html)
- [弄清楚 babel 的 stage](https://zhuanlan.zhihu.com/p/25961891)
- [再见，babel-preset-2015](https://zhuanlan.zhihu.com/p/29506685)
- [ECMAScript 6 的模块相比 CommonJS 的 require (...)有什么优点？](https://www.zhihu.com/question/27917401/answer/223309781)
