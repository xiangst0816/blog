---
title: 第十三章 事件
author: 烈风裘
date: 2018-03-05T04:44:25.460Z
draft: false
comments: true
star: false
cover: ''
tags:
  - JS高程
---

> 这里所说的事件是指: JavaScript 和 HTML 之间交互的事件. 也就是说, 浏览器文档在交互的过程中会以事件的方式通知绑定的**监听器**. 这里使用了传统软件工程的**观察者模式**的设计模型, 实现**JavaScript**与**文档(HTML/CSS)**之间的解耦.

### 1. 事件流理解?

事件流描述的是从页面中接收事件的顺序.

"DOM2 级事件" 规定的事件流包括三个阶段：事件捕获阶段、处于目标阶段和事件冒泡阶段。

```
从Document开始 -- 捕获阶段 --> ( 目标阶段 -- 冒泡阶段 --> Document)
```

目标阶段是冒泡阶段的一部分.

### 2. 这样绑定事件处理程序的问题?

```html
<input type="button" value="Click Me" onclick="alert(this.value)">
```

- 定义绑定事件的函数可能晚于用户点击交互导致报错
- 这样扩展事件处理程序的作用域链在不同浏览器中会导致不同结果
- 耦合紧密, 维护麻烦
- 只能绑定一个

### 3. 下面这样添加事件处理程序的问题?

```js
var btn = document.getElementById("myBtn");
btn.onclick = function() {
  alert(this.id); //"myBtn"
};
```

- 只能绑定一个

### 4. `btn.addEventListener(eventName, handler, useCapture)`接收的第三个参数是?

最后这个布尔值参数如果是 true，表示在捕获 阶段调用事件处理程序；如果是 false，表示在冒泡阶段调用事件处理程序

> IE9、Firefox、Safari、Chrome 和 Opera 支持 DOM2 级事件处理程序。

### 5. 在 IE 中使用`btn.attachEvent`的问题?

- 事件处理函数中的 this 指向的是 window
- 可添加多个事件, 但是是**以相反的顺序被触发的**
- 只在冒泡阶段触发

> IE8-

### 6. 事件对象中, `this` / `target` / `currentTarget`三个属性的含义?

- `this`: 指向**绑定事件处理函数的元素**
- `currentTarget`: 同`this`
- `target`: 指向**事件真正的目标**, 可能因为真正的目标没绑定这个事件处理函数, 因此冒泡到了外面

如果绑定的元素没有子元素, 则, 三者相等; 如果是事件代理, 则`target`指向真正触发事件的元素. 事件代理可以对`target`进行判断.

### 7. 事件对象中的`event.type`有什么作用?

如果监听被触发, 则`event.type`和绑定时的`eventName`相同, 一般用于区分在元素上绑定的事件类型, 处理不同类型的事件绑定情形.

### 8. 事件对象中的`preventDefault()`有什么作用?

阻止特定事件的默认行为, 只有 cancelable 属性设置为 true 的事件，才可以使用 preventDefault()来取消其默认行为。

例如，链接的默认行为就是在 被单击时会导航到其 href 特性指定的 URL。

### 9. 事件对象中的`event.stopPropagation()`有什么作用?

立即停止事件在 DOM 层次中的传播(**Stop Propagation**)，即取消进一步的事件 **捕获或冒泡**。

### 10. 事件对象中的`eventPhase`含义?

- `eventPhase===1`: 在**捕获阶段**调用的事件处理程序
- `eventPhase===2`: 如果事件处理程序处于目标对象上时(实测没出现过)
- `eventPhase===3`: 在**冒泡阶段**调用的事件处理程序

### 11. 判断页面加载完毕的属性和事件有哪些?

**判断**

```js
document.readyState === "complete";
```

**监听**

```js
window.onload = function() {};
window.addEventListener("load", completed, false);
document.addEventListener("DOMContentLoaded", completed, false);
```

**load**和**DOMContentLoaded**两个事件的区别?

- 当初始 HTML 文档被完全加载和解析时，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架完成加载。
- 另一个不同的事件 load **会在页面中的一切都加载完毕时触发**。
- DOMContentLoaded 这个事件始终都会在 load 事件之前触发
- DOMContentLoaded 目标实际上是 document
- 在不同页面中，load 事件与 readystatechange 事件并 不能保证以相同的顺序触发

所以可以知道，当一个页面加载时应**先触发 DOMContentLoaded 然后才是 onload**. 类似的事件及区别包括以下几类：

- DOMContentLoaded: 在形成完整的 DOM 树之后就会触发， 不理会图像、JavaScript 文件、CSS 文件或其他资源是否已经下载完毕。
- readystatechange: 一个 document 的 Document.readyState 属性描述了文档的加载状态，当这个状态发生了变化，就会触发该事件；
- load: 在页面中的一切都加载完毕时触发，但这个**过程可能会因为要加载的外部资源过多而颇费周折**。
- beforeunload: 当浏览器窗口，文档或其资源将要卸载时，会触发 beforeunload 事件。
- unload: 当文档或一个子资源正在被卸载时, 触发 unload 事件。

### 12. 能发出 load 事件的地方有哪些?

- window
- img
- script
- link

### 13. `resize`和`scroll`事件使用注意?

```js
window.addEventListener("scroll", function() {
  var scrollTop = document.documentElement.scrollTop; // 获取scrollTop
});
```

- **scroll 事件是在 window 对象上发生的**，但它实际表示的则是页面中相应元素的变化
- 所有浏览器都会通过`<html>`元素来反映这一变化, 就是`document.documentElement`
- 监听函数会频繁执行, 1) 函数节流; 2)有必要尽量保持事件处理程序的代码简单; 3)使用 raf
- scroll 也可以在元素上监听

### 14. 焦点事件有哪些, 使用场景是?

用于获取用户在页面上的行踪.

**document 上:**

- document.hasFocus()
- document.activeElement

**元素上:**

- focusin
- focus
- focusout

### 15. 关于鼠标事件的一些注意点

- 除了 mouseenter 和 mouseleave，所有鼠标事件都会冒泡， 也可以被取消，而取消鼠标事件将会影响浏览器的默认行为
- 只有在同一个元素上相继触发 mousedown 和 mouseup 事件， 才会触发 click 事件；如果 mousedown 或 mouseup 中的一个被取消，就不会触发 click 事件.

### 16. 鼠标事件对象中的位置属性 clientX/pageX/screenX 等的含义

- clientX/clientY: 以**浏览器页面窗口为边距**的位置
- pageX/pageY: 以**页面为边距**的位置, 比如存在 scroll 时
- screenX/screenY: 以**系统的显示器为边距**的位置

### 17. 鼠标键和修改键的组合如何实现?

这些修改键就是 Shift、Ctrl、Alt 和 Meta（在 Windows 键盘中是 Windows 键，在苹果机中 是 Cmd 键），它们经常被用来修改鼠标事件的行为。DOM 为此规定了 4 个属性，表示这些修改键的状态：shiftKey、ctrlKey、altKey 和 metaKey。例如:

```js
if (event.shiftKey) {
  keys.push("shift");
}
```

### 18. 鼠标右键单击事件如何实现?

对于 mousedown 和 mouseup 事件来说，则在其 event 对象存在一个 button 属性， 表示按下或释放的按钮。

DOM 的 button 属性可能有如下 3 个值：0 表示主鼠标按钮，1 表示中间的鼠 标按钮（鼠标滚轮按钮），2 表示次鼠标按钮。

但是 IE8-的返回值有比较大的差异, 需要注意!.

### 19. textInput 事件和 keypress 事件的区别?

- textInput 事件主要考虑的是**字符**，因此它的 event 对象中还包含一个 data 属性，这个属 性的值就是用户输入的字符（而非字符编码）
- 是任何可以获得焦点的元素都可以触发 keypress 事件，但**只有可编辑区域才能触发 textInput 事件**
- textInput 事件只会在**用户按下能够输入实际字符的键**时才会被触发，而 keypress 事件则在按下那些能够影响文本显示的键时也会触发（例如退格键）
- 支持 textInput 属 性的浏览器有 IE9+、Safari 和 Chrome。

### 20. DOM 变动(增删改)是否能检测, 如何检测?

- DOMSubtreeModified: 整个 DOM 结构变更是触发
- DOMNodeInserted: 子节点插入另一个节点时触发
- DOMNodeRemoved: 节点从其父节点移除时触发
- DOMNodeInsertedIntoDocument: 节点插入到**文档中**时触发
- DOMNodeRemovedFromDocument: 节点从**文档中**删除时触发
- DOMAttrModified: 节点属性被修改时触发
- DOMCharacterDataModified: 文本节点的值发生变化时触发

IE9+

**[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)**

> MutationObserver 给开发者们提供了一种能在某个范围内的 DOM 树发生变化时作出适当反应的能力.该 API 设计用来替换掉在 DOM3 事件规范中引入的 Mutation 事件.

- 它等待所有脚本任务完成后，才会运行，即采用异步方式。
- 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条地个别处理 DOM 变动。
- 它既可以观察发生在 DOM 的所有类型变动，也可以观察某一类变动。

IE11+

### 21: 内存和性能注意点

- 事件委托

通过`event.target`获取点击的元素; 通过`event.type`获取事件类型.

- 移除无用的事件

比如删除 DOM 后移除绑定的事件, 只能手动解除.

### 22. 模拟事件的过程是怎样的?

```js
var btn = document.getElementById("myBtn");

//创建事件对象
var event = document.createEvent("MouseEvents");

//初始化事件对象
event.initMouseEvent(
  "click",
  true,
  true,
  document.defaultView,
  0,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null
);

//触发事件
btn.dispatchEvent(event);
```

这里的事件包括:

- UIEvents: UIEvent, initUIEvent
- MouseEvents: MouseEvent, initMouseEvent
- MutationEvents: MutationEvent, initMutationEvent
- HTMLEvents: 一般化的 HTML 事件
- CustomEvents: CustomEvent, initCustomEvent, 自定义事件

例如 HTMLEvents 事件:

```js
var event = document.createEvent("HTMLEvents");
event.initEvent("focus", true, false);
target.dispatchEvent(event);
```

### 23. 如何自定义事件并触发?

**event.initCustomEvent**

- type（字符串）：触发的事件类型，例如"keydown"。
- bubbles（布尔值）：表示事件是否应该冒泡。
- cancelable（布尔值）：表示事件是否可以取消。
- detail（对象）：任意值，保存在 event 对象的 detail 属性中。

```js
var event = document.createEvent("CustomEvent");
event.initCustomEvent("myevent", true, false, "Hello world!");
div.dispatchEvent(event);
```

### 24. 多点手势的原理?

### 25. `addEventListener`传参的第三个参数中有哪些属性，含义是？

#### `capture`

默认为 false。如果设为 true，则表示在 capture 阶段触发事件。

#### `once`

默认为 false。如果为 true，表示事件只触发一次。事件处理函数会在被调用后自动移除。

#### `passive`

表示 listener 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。

这个属性存在的含义主要是为了**优化滚屏性能**，也就是说，当添加了`passive`属性后，**`touchmove`事件不会阻塞页面的滚动**（同样适用于鼠标的滚轮事件）。
