---
title: 异步相关操作（注意点）
author: 烈风裘
date: 2018-04-17T08:25:47.433Z
draft: true
comments: true
star: false
cover: ''
tags:
  - 未归档
---

## Promise

> Promise 可以理解为一个状态包！**ES6 标准**

### 基础 API 注意点

- 内部状态有：pending（进行中）、fulfilled（完成）、rejected（拒绝），同一时间只有一个状态
- **rejected 状态在 catch 中处理后会转为 fulfilled**
- 内部状态**不受外部影响**
- 内部状态**结果可以随时获取**
- `new Promise`中的回调函数**立即执行**

#### 1. Promise.prototype.then()

- 返回新 Promise 实例，满足链式调用
- 后面的 then 接受前面的 Promise 返回结果
- 每个 then 的回调函数都会推到 microtask 中，**而不是立即执行**

#### 2. Promise.prototype.catch()

- rejected 状态会向下传递，catch 接受传递的 rejected 状态
- catch 接收之后会**消化**这个错误，将状态变为 fulfilled 状态**（切记）**
- 如果错误未捕获，则会有事件 `unhandledrejection` 触发

```js
window.addEventListener("unhandledrejection", e => {
  // code
});
```

#### 3. Promise.prototype.finally()

> ES2018 引入标准

不管状态最终如何都会执行。

#### 4. Promise.all()

```js
const p = Promise.all([p1, p2, p3]);
```

- 全部转为 fulfilled 后，p 的状态才转为 fulfilled
- 注意**catch**有能将 rejected 的状态改为 fulfilled 状态的能力
- p 的 resolve 返回数组

#### 5. Promise.race()

```js
const p = Promise.race([p1, p2, p3]);
```

- 竞态

#### 6. Promise.resolve() / Promise.reject()

将现有对象转成 Promise 对象。

## async/await

> **ES2017 标准**，Generator 函数的语法糖。

### 基础

**Generator 函数**

```js
const gen = function*() {
  const f1 = yield readFile("/etc/fstab");
  const f2 = yield readFile("/etc/shells");
  console.log(f1.toString());
  console.log(f2.toString());
};
```

**async 函数**

```js
const asyncReadFile = async function() {
  const f1 = await readFile("/etc/fstab");
  const f2 = await readFile("/etc/shells");
  console.log(f1.toString());
  console.log(f2.toString());
};
```

`async`函数就是将 `Generator` 函数的星号（\*）替换成`async`，将`yield`替换成`await`，仅此而已。

不同的地方：

- `async`自带执行器，不像 `Generator` 函数，需要调用 `next` 方法
- 更好的语义
- `await`之后不一定是`Promise`类型
- 返回`Promise`对象

#### 1. 原理：

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

#### 2. await 命令

- await 命令后面是一个 Promise 对象。如果不是，会被转成一个立即 resolve 的 Promise 对象
- 只要一个 await 语句后面的 Promise 变为 reject，那么整个 async 函数都会中断执行

```js
async function f() {
  await Promise.reject("出错了");
  await Promise.resolve("hello world"); // 不会执行
}
```

**解决办法：**

- catch 捕获转化为 resolved 状态
- try/catch 包裹

#### 3. 技巧

**实现多次重复尝试：**

```js
const superagent = require("superagent");
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get("http://google.com/this-throws-an-error");
      break;
    } catch (err) {}
  }
  console.log(i); // 3
}

test();
```

**同步转异步：**

```js
let foo = await getFoo();
let bar = await getBar();
// ->
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
```

**和循环使用(不用 forEach)：**

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];

  for (let doc of docs) {
    await db.post(doc);
  }
}
```

**继发执行：**

```js
async function logInOrder(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```
