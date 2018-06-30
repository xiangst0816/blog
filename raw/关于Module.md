# 关于Module



CommonJS和AMD模块都只能**在运行时**才能确定模块导出的**对象**。因此运行时才能得到整个对象，也就无法做到静态优化。而ES6从语法层面支持模块功能，其设计初衷就是就是尽量的静态化，使得代码在编译时就能确定模块的依赖关系。



ES6关于Module的介绍参考阮一峰的ES6教程：[ECMAScript 6 入门-Module 的语法](http://es6.ruanyifeng.com/#docs/module)。下面是平时用到比较少的部分，使用时应该注意的地方。



## ES6模块使用时的注意点



- 模块转发时，当前模块不能使用转发的变量

```typescript
export { foo, bar } from 'my_module';
console.log(foo) // error
```



- default本质上就是输出一个叫default的变量或方法，然后系统允许你为他任意取名

```typescript
export {add as default};
// 等同于
export default add;
```

```typescript
import { default as foo } from 'modules';
// 等同于
import foo from 'modules';
```



## 浏览器加载ES6模块时的注意点



- defer和async的区别：`defer`是“渲染完再执行”，保证顺序；`async`是“下载完就执行”，不保证顺序。
- `type="module"`时，默认为defer模式

```html
<script type="module" src="./foo.js"></script>
<!-- 等同于 -->
<script type="module" src="./foo.js" defer></script>
```



## ES6模块与CommonJS模块的差异



在整理JavaScript总Module相关的知识点时，不得不提CommonJS与ES6的import/export之间的关系。最主要的提点如下，其余部分都是从这两点的引申，所以不再重复。



- CommonJS 模块输出的是一个**值的拷贝**，ES6 模块输出的是值的**引用**。
- CommonJS 模块是**运行时加载**，ES6 模块是**编译时**输出接口。



## CommonJS中在`module.exports`和`exports`的区别？



Nodejs[文档说明](http://nodejs.cn/api/modules.html#modules_exports_shortcut)以解释了两者的区别，总的来说就五点：

1. module.exports 初始值为一个空对象 {}
2. exports 表示别名， 默认是指向 module.exports 的引用
3. 如果新值赋值给exports，那他就不再指向module.exports
4. require() 返回的是 module.exports 而不是 exports
5. 如果两者产生困惑，那就忽视exports，直接使用module.exports



> module.exports: 我才是老大！exports只是我的昵称。



保险起见，可以这样使用：

```js
module.exports = exports = function Constructor() {
    // code here
}
```



(完)