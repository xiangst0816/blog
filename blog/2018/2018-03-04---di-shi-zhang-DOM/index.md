---
title: 第十章 DOM
author: 烈风裘
date: 2018-03-04T07:17:28.783Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - JS高程
---

### 1. 对 DOM 树形结构的理解?

#### DOM 解释

**DOM(文档对象模型)**, 是针对类 HTML 层次化节点树**操作**的一个**API(应用程序编程接口)**集合. 用于更改底层文档及外观结构.

#### 根节点

树中的节点可以由多种**Node 类型**组成, 根节点称之为**文档元素**(传说的`document`), 即`<html></html>`.

#### Node 类型

类型可以是:

- **Node.ELEMENT_NODE(1)**；子元素
- Node.ATTRIBUTE_NODE(2)；
- **Node.TEXT_NODE(3)**； 文本
- Node.CDATA_SECTION_NODE(4)；
- Node.ENTITY_REFERENCE_NODE(5)；
- Node.ENTITY_NODE(6)；
- Node.PROCESSING_INSTRUCTION_NODE(7)；
- **Node.COMMENT_NODE(8)**；注释
- **Node.DOCUMENT_NODE(9)**；表示整个 HTML 页面, document
- Node.DOCUMENT_TYPE_NODE(10)；
- Node.DOCUMENT_FRAGMENT_NODE(11)；
- Node.NOTATION_NODE(12)

每个类型所具有的 API 及同名 API 的含义不同, 使用前先判断下.

此外, `NodeList`类型是类数组对象, 如果要像数组使用, 需要转化一下:

```js
Array.prototype.slice.call(xx.childNodes, 0);
```

#### Node 查找 API

关于 Node 前后的关系属性需要知道的名称有:

- `firstChild()`
- `lastChild()`
- `parentNode()`
- `childNodes()` (注意`hanChildNodes()`函数判断是否有子节点)
- `nextSlibing()`
- `previousSlibling()`

#### Node 操作 API

- `appendChild()` 向 childNodes 列表的末尾添加一个节点, 更新完毕返回新增节点
- `insertBefore()` 在某个特定的位置上插入节点
- `replaceChild()`
- `removeChild()`
- `cloneNode()` 建议复制前先移除上面的事件绑定, IE 有问题

### 2. `<!DOCTYPE>`是什么含义, 不写或写错会有什么后果?

用来声明文档类型, 通过`document.doctype`获得. 用于告诉浏览器当前的文档所使用标记(标签)版本, **影响最终的页面呈现效果**!

如果页面没写着行说明, 则浏览器解析页面会出现怪异行为, 比如盒模型/size 解析/内联元素尺寸/图片对齐方式等.

### 3. 如何获取对 `body` / `html` Node 节点的引用?

```js
var html = document.documentElement;
var body = document.body;
// 同理
var head = document.head;
```

### 4. 在`<!DOCTYPE>`前或者`<html>`前后写注释会有什么影响?

不同浏览器间对注释的解释不一致, 导致了位于<html>元素外部的注释没有什么用处.

另外, document 属性是只读的, 在其前后插入 Node 不可行.

### 5. 不同域或者子域因为跨域安全限制, 不能 JS 直接通信, 怎么破?

- 不同域无法破解
- 相同子域可修改`document.domain`解决

比如: p2p.wrox.com 和 wrox.com js 通信, 可在 p2p.wrox.com 的网页中设置:

```js
document.domain = "wrox.com";
```

之后即可通讯, 如果 wrox.com -> p2p.wrox.com 这样是不行的.

### 6. `document.write()`在文档加载结束前后使用有什么差异?

- 文档加载结束前: 会在输出流中写入内部文本, 可**用于动态包含外部资源**
- 文档加载结束后: 会用内部文本重写整个页面

### 7. 这段代码的问题是?

```html
<html>
<head>
	<title>document.write() Example 2</title>
</head>
<body>
<script type="text/javascript">
	document.write("<script type=\"text/javascript\" src=\"file.js\">"
	+ "</script>");
</script>
</body>
</html>
```

代码到这里`+ "</script>");`会终止, 页面最后一行显示`");`文本.

解决办法是将`+ "</script>");`替换为`+ "<\/script>");`

### 8. 动态插入脚本的一般过程?

#### 插入外部文件

```js
function loadScript(url) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  document.body.appendChild(script);
}
```

#### 直接插入代码

```js
function loadScriptString(code) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  try {
    script.appendChild(document.createTextNode(code));
  } catch (ex) {
    script.text = code;
  }
  document.body.appendChild(script);
}
```

### 9. 插入样式的一般过程?

**!!样式插入到 head 中!!**

#### 插入外部文件

```js
function loadStyles(url) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}
```

#### 直接插入代码

```js
function loadStyleString(css) {
  var style = document.createElement("style");
  style.type = "text/css";
  try {
    style.appendChild(document.createTextNode(css));
  } catch (ex) {
    style.styleSheet.cssText = css;
  }
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
}
```

### 10. NodeList 特性理解?

- **动态**的集合, 当文档更新后再次获取 NodeList 能拿到更新结果
- 操作 DOM 很耗时, **应该尽量减少访问 NodeList 的次数**. 因为每次访问 NodeList，都会运行一次基于文档的查询.
