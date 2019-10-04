---
title: Flex布局及在移动端的应用
author: 烈风裘
date: 2017-05-25T01:12:39.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - CSS
---

前端发展很快，以前在移动端使用 Flex 布局还要**想三想**的文章也许已经过时了，这篇文章主要介绍使用 Flex 进行常规布局及在移动端的处理。

## Flex 语法

Flex 布局意为"弹性布局"，用来为盒模型提供更多灵活性。此外，Flex 定义的容器可以对块级元素(`display: flex;`)或行内元素(`display: inline-flex;`)生效，需要注意的是，如果父元素设置了 Flex 容器，则子元素的`float`、`clear`和`vertical-align`属性将失效。

Flex 布局需要注意**下面几个重要的概念**，结合下面这张图也许能更好的理解:

- flex 容器(flex container)
- flex 项目(flex item)
- 主轴(main axis)
- 交叉轴(cross axis)
- 开始位置(start)
- 结束位置(end)

![](http://upload-images.jianshu.io/upload_images/2036128-102577302e07d171.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 提示：定义在容器(container)上的属性和定义在项目(item)上的属性不可搞混!

关于语法的其余部分，请参考阮一峰的教程，希望你能熟记里面的示例图:

- Flex 布局教程: [语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- Flex 布局教程: [实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

上面部分搞定，趁热打铁做一下下面的练习，做上两次基本上 Flex 就基本没问题了。

- Flex 训练游戏: [地址](http://flexboxfroggy.com/?utm_source=jsgroup#zh-cn)

## Flex 常规布局

### 1. 单列布局

单列布局使用场景非常多，用来实现文本或者 block 的居中效果。对外部容器定义就可实现内部布局效果，实现起来非常简单，尤其是使用响应式布局中。以下示例都是 Flex 的基本使用语法。

基本的 DOM 结构如下:

```html
<div class="parent">
   <div class="children"></div>
</div>
```

#### - 水平居中

```
.parent{
  display:flex;
  justify-content:center;
}
```

#### - 垂直居中

```
.parent{
  display:flex;
  align-items:center;
}
```

#### - 水平垂直全部居中

```
.parent{
  display:flex;
  justify-content:center;
  align-items:center;
}
```

### 2. 多列布局

多列布局使用较多，比如商品展示需要在左侧显示图片，右侧显示详情；

多列布局的示例 DOM 结构如下:

```
    <div class="container">
        <div class="left">Left</div>
        <div class="right">Center</div>
        <div class="center">Right</div>
    </div>
```

#### - 左列定宽，右列自适应 | 右列定宽，左列自适应(同理)

> 该布局方式非常常见，适用于定宽的一侧常为导航，自适应的一侧为内容的布局。

##### 示例

![一列定宽，一列自适应](http://upload-images.jianshu.io/upload_images/2036128-a9a8075e63c38733.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 样式

```css
.container {
  display: flex;
}
.left {
  flex: 0 0 300px;
}
.right {
  flex: 1;
}
```

#### - 左中两列定宽，右侧列自适应

##### 示例

![左中两列定宽，右侧列自适应](http://upload-images.jianshu.io/upload_images/2036128-58b2d7096bc3f532.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 样式

```css
.container {
  display: flex;
}
.left，.center {
  flex: 0 0 100px;
}
.right {
  flex: 1;
}
```

#### - 两侧定宽，中栏自适应

##### 示例

![两侧定宽，中栏自适应](http://upload-images.jianshu.io/upload_images/2036128-6e4e139264c044c5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 样式

```css
.container {
  display: flex;
}
.left {
  width: 100px;
}
.center {
  flex: 1;
}
.right {
  width: 100px;
}
```

#### - 一列不定宽，一列自适应

##### 示例

![一列不定宽，一列自适应](http://upload-images.jianshu.io/upload_images/2036128-8ec7dd4d015f8eee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 样式

```css
.container {
  display: flex;
}
.right {
  flex: 1;
}
```

#### - 多列等分布局

> 多列等分布局常出现在内容中，多数为功能的，同等级内容的并排显示等。

##### 示例

![多列等分布局](http://upload-images.jianshu.io/upload_images/2036128-34ba21dc0ae5f7d1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 样式

```
.container{
  display:flex;
}
.left，.center，.right {
  flex:1;
}
```

### 3. 九宫格布局

##### 示例

![九宫格布局](http://upload-images.jianshu.io/upload_images/2036128-61ecf0bfcbc0875b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### DOM 结构

```html
    <div class="container">
        <div class="row">
            <div class="left">Left</div>
            <div class="right">Center</div>
            <div class="center">Right</div>
        </div>
        <div class="row">
            <div class="left">Left</div>
            <div class="right">Center</div>
            <div class="center">Right</div>
        </div>
        <div class="row">
            <div class="left">Left</div>
            <div class="right">Center</div>
            <div class="center">Right</div>
        </div>
    </div>
```

##### 样式

```scss
.container {
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 300px;
  .row {
    height: 100px;
    display: flex;
  }
  .left，.center，.right {
    flex: 1;
    height: 100px;
  }
}
```

### 4. 圣杯布局

##### 示例

![圣杯布局](http://upload-images.jianshu.io/upload_images/2036128-4eab812e11fee2e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### DOM 结构

```html
    <div class="container">
        <header class="header">
            Header
        </header>
        <article class="article">
            <nav class="nav">Nav</nav>
            <section class="body">Body</section>
            <aside class="aside">Aside</aside>
        </article>
        <footer class="footer">
            Footer
        </footer>
    </div>
```

##### 样式

```scss
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  .header，.footer {
    flex: 0 0 100px;
  }
  .article {
    display: flex;
    flex: 1;
    .nav {
      flex: 0 0 100px;
    }
    .body {
      flex: 1;
    }
    .aside {
      flex: 0 0 100px;
    }
  }
}
```

### 5. 响应式布局

#### 设置 meta

使用前需要对设置 meta 标签，设置布局宽度等于设备宽度，布局 viewport 等于度量 viewport。

```
<meta name='viewport' content='width=device-width，initial-scale=1'>
```

#### 媒体查询

HTML 4 和 CSS 2 目前支持为不同的媒体类型设定专有的样式表，比如，一个页面在屏幕上显示时使用无衬线字体，而在打印时则使用衬线字体，screen 和 print 是两种已定义的媒体类型，媒体查询让样式表有更强的针对性，扩展了媒体类型的功能; 媒体查询由媒体类型和一个或多个检测媒体特性的条件表达式组成，媒体查询中可用于检测的媒体特性有 width、height 和 color（等），使用媒体查询，可以在不改变页面内容的情况下，为特定的一些输出设备定制显示效果。

```
@media screen and (max-width:960px){....}
<link rel='stylesheet' media='screen and (max-width:960px)' href='xxx.css' />
```

## 兼容性问题解决方案

对于移动端的处理主要是解决兼容性，毕竟新出的事物普遍接受还是需要过程的，但是把握趋势对不兼容的情况需要做好补丁。这里是 Caniuse.com 上的关于 Flex 的[兼容性](http://caniuse.com/#search=flex)。

我在开发的要求是能用工具处理的不进行人为干预，因为这样会增加开发及维护成本，浪费生命。 有句话: "工欲善其事必先利其器"，因此按照 Flex 的标准去开发，剩余的事情交给自动化工具处理。

这里使用的工具是[gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)，配置的参数：

```
{
  browsers: [
    'last 2 versions',
    'iOS >= 7',
    'Android >= 4'],
  cascade: false
}
```

**源码**

```
{
  display: flex;
  flex: 1;
  align-items: center;
}
```

**兼容后**

```
{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
```

## 最后

Flex 布局高效简洁且有兼容性处理方案，因此朝这个趋势走不会有错。

## 参考

- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [A Visual Guide to CSS3 Flexbox Properties](https://scotch.io/tutorials/a-visual-guide-to-css3-flexbox-properties)
