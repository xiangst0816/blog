---
title: CSS优先级计算及应用
author: 烈风裘
date: 2017-05-24T05:52:01.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - CSS
---

梳理这部分是因为在使用组件模式开发 h5 应用会出现组件样式修改未生效的问题，在解决样式修改的问题前，需要理清楚 CSS 样式生效的优先级。样式根据引入和声明需要分开介绍，分为**引入样式优先级**和**声明样式优先级**。

## 引入样式优先级

引入样式优先级一般是在外部样式、内部样式、内联样式之间应用同一个样式的情况是使用， 优先级如下：

- **外部样式** | **内部样式** < **内联样式**
- **外部样式**和**内部样式**，最后出现的优先级最高，例如：

```html
<!-- 内联样式 -->
<span style="color:red;">Hello</span>

<style type="text/css">
     /* 内部样式 */
     h3{color:green;}
 </style>

<!-- 外部样式 style.css -->
<link rel="stylesheet" type="text/css" href="style.css"/>
```

因此，对于一些重置的样式集，比如**normalize.css/reset.css**必须写在所有样式的前面。

> PS: 没有外联样式，[参考](http://www.w3school.com.cn/html/html_css.asp)。

## 声明样式优先级

### 1. 大致的优先级

一般来说满这个规则：

- 继承不如指定
- !important > 内联 > ID > Class|属性|伪类 > 元素选择器
- :link、:visited、:hover、:active 按照 LVHA（LoVe HAte）顺序定义

上面是优先级算法反映出的大致结果，在一般的开发中熟记即可。如果需要进一步研究原理，则了解下优先级算法。

### 2. 优先级算法

选择器的特殊性值分为四个等级，如下：

| 等级   | 标签内选择符                | ID 选择符           | Class 选择符/属性选择符/伪类选择符           | 元素选择符         |
| ------ | --------------------------- | ------------------- | -------------------------------------------- | ------------------ |
| 示例   | `<span style="color:red;">` | `#text{color:red;}` | `.text{color:red;} [type="text"]{color:red}` | `span{color:red;}` |
| 标记位 | x,0,0,0                     | 0,x,0,0             | 0,0,x,0                                      | 0,0,0,x            |

#### 特点:

- 每个等级的初始值为 0，
- 每个等级的叠加为选择器出**现的次数相加**
- 不可进位，比如`0,99,99,99`
- 依次表示为：0,0,0,0
- 每个等级计数之间没关联
- 等级判断从左向右，如果某一位数值相同，则判断下一位数值
- 如果两个优先级相同，则最后出现的优先级高，`!important`也适用
- 通配符选择器的特殊性值为：`0,0,0,0`
- **继承样式优先级最低**，通配符样式优先级高于继承样式

#### 计算示例：

- `a{color: yellow;} /*特殊性值：0,0,0,1*/`
- `div a{color: green;} /*特殊性值：0,0,0,2*/`
- `.demo a{color: black;} /*特殊性值：0,0,1,1*/`
- `.demo input[type="text"]{color: blue;} /*特殊性值：0,0,2,1*/`
- `.demo *[type="text"]{color: grey;} /*特殊性值：0,0,2,0*/`
- `#demo a{color: orange;} /*特殊性值：0,1,0,1*/`
- `div#demo a{color: red;} /*特殊性值：0,1,0,2*/`

#### 生效示例：

```html
<a href="">第一条应该是黄色</a> <!--适用第1行规则-->
<div class="demo">
    <input type="text" value="第二条应该是蓝色" /><!--适用第4、5行规则，第4行优先级高-->
    <a href="">第三条应该是黑色</a><!--适用第2、3行规则，第3行优先级高-->
</div>
<div id="demo">
    <a href="">第四条应该是红色</a><!--适用第6、7行规则，第7行优先级高-->
</div>
```

#### 关于伪类 LVHA 的解释

a 标签有四种状态：链接访问前、链接访问后、鼠标滑过、激活，分别对应四种伪类:link、:visited、:hover、:active；

- 当鼠标滑过 a 链接时，满足`:link`和`:hover`两个伪类，要改变 a 标签的颜色，就必须将:hover 伪类在:link 伪类后面声明；
- 当鼠标点击激活 a 链接时，同时满足:link、:hover、:active 三种状态，要显示 a 标签激活时的样式（:active），必须将:active 声明放到:link 和:hover 之后。因此得出 LVHA 这个顺序。

这个顺序能不能变？可以，但也只有:link 和:visited 可以交换位置，因为一个链接要么访问过要么没访问过，不可能同时满足，也就不存在覆盖的问题。

## 在组件中的应用

目前的前端开发为了增加开发效率，会对常用组件进行封装，此外，组件还会添加一些必要的结构样式。但是业务的设计文稿中可不一定按照预先写好的默认样式，需要在开发业务时根据组件的 DOM 结构修改默认样式，此时会出现样式不生效的问题。

例如下面的结构，如果对 Title 直接增加样式类，则肯定不会生效，因为 Title 的 DOM 结构为两层(组件样式定义规定不能使用 ID 选择器，且类选择器满足最小标记原则)），故样式最多为`0,0,2,x`。因此，样式多层标记就可提高自定义样式的优先级，例如下方的 SCSS 写法。

```html
<Page class="test">
    <Header class="test__header">
        <Navbar>
            <Title class="test__header--title">Toolbar</Title>
        </Navbar>
    </Header>
    <Content></Content>
</Page>
```

```scss
.test {
  .test__header {
    .test__header--title {
      height: 100px;
    }
  }
}
```

> 此外，对于`Page`组件的样式标记策略推荐使用**金字塔形(树形)**，比如上面的 SCSS 书写，这样可以保证内部自定义样式不会受到外部干扰，减少不必要的麻烦。

## 参考

- [css 优先级计算规则](http://www.cnblogs.com/wangmeijian/p/4207433.html)
- [关于 CSS 的优先级,CSS 优先级计算,多个 class 引用](http://blog.csdn.net/jie1336950707/article/details/49046371)
- [样式表定义](http://www.w3school.com.cn/html/html_css.asp)
