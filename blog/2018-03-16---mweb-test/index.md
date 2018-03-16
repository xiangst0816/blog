---
title: MWeb 测试
author: 烈风裘
date: 2018-03-16T07:49:24.860Z
draft: false
comments: false
star: false
cover: ''
tags: 
  - 未归档
---

# 欢迎使用 MWeb

首先介绍一下 MWeb 是什么，MWeb 是专业的 Markdown 写作、记笔记、静态博客生成软件。

然后这里**重点说明**一下：MWeb 有**两个模式**，外部模式和文档库模式。外部模式中把本地硬盘或 Dropbox 等网盘的文件夹引入，就可以使用 MWeb 的拖拽、粘贴插入图片、图床等特色功能。文档库模式设计为用于记笔记和静态博客生成。对于有**同步和协作需求**的朋友，请使用外部模式！使用视图菜单或者快捷键 `CMD + E` 可以打开外部模式，`CMD + L` 可以打开文档库。

## MWeb 大概用法、视图模式和预览界面

MWeb 使用菜单、快捷键和少量按钮完成所有操作，一般常用的操作都会有快捷键。整个界面使用三栏式结构，非常简洁。左边的第一第二栏是使用**右键**和底部的几个按钮操作，另外就是右上角有三个按钮了（外部模式是两个），快捷键分别是：`CMD + 7/8/9`。另外就是切换视图模式的快捷键了，建议看一下 `标记` 菜单和 `视图` 菜单。

* 快捷键：`CMD + 1` 是在仅编辑器模式和三栏模式中切换。
* 快捷键：`CMD + 2` 是在二栏模式和仅编辑器模式中切换。
* 快捷键：`CMD + 3` 是在三栏模式和仅编辑器模式中切换。
* 快捷键：`CMD + 4` 是在编辑器/预览模式和三栏模式中切换。
* 快捷键：`CMD + R` 是在编辑器和预览模式中切换。

**特别说明**：当 `偏好设置` - `通用设置` 中 `切换视图模式（二三栏）时，保持编辑器大小不变` 被勾选后，`CMD + 1/2/3/4` 的行为会发生变化，具体如何，可以尝试一下。而 `在新窗口中打开实时预览（CMD + R）` 这个选项被选中后，快捷键 `CMD + R` 会打开新的窗口来预览文档。

## 更多的了解 MWeb

* MWeb 使用的是 Github Flavored Markdown 语法，请一定要打开 `帮助` - `Markdown 语法` 菜单看一下。
* 请一定要去官网首页看看，网址：<http://zh.mweb.im>。
* 请一定要看一下官网的帮助，用菜单 `帮助` - `帮助...` 即可打开，也可以用网址：<http://zh.mweb.im/help.html>。

## 帮助我们改进 MWeb

如果你喜欢 MWeb，想让它变得更好，你可以：

1. 推荐 MWeb，让更多的人知道。
2. 给我们发反馈和建议：<coderforart+233@gmail.com>
3. 在 Mac App Store 上评价 （如果是在 MAS 上购买的话）。

# Markdown 语法和 MWeb 写作使用说明

## Markdown 的设计哲学

> Markdown 的目標是實現「易讀易寫」。
> 不過最需要強調的便是它的可讀性。一份使用 Markdown 格式撰寫的文件應該可以直接以純文字發佈，並且看起來不會像是由許多標籤或是格式指令所構成。
> Markdown 的語法有個主要的目的：用來作為一種網路內容的*寫作*用語言。

<!-- more -->

## 本文约定

如果有写 `效果如下：`， 在 MWeb 编辑状态下只有用 `CMD + 4` 或 `CMD + R` 预览才可以看效果。

## 标题

Markdown 语法：

```markdown
# 第一级标题 `<h1>` 
## 第二级标题 `<h2>` 
###### 第六级标题 `<h6>` 
```

效果如下：

# 第一级标题 `<h1>` 
## 第二级标题 `<h2>` 
###### 第六级标题 `<h6>` 



## 强调

Markdown 语法：

```markdown
*这些文字会生成`<em>`*
_这些文字会生成`<u>`_

**这些文字会生成`<strong>`**
__这些文字会生成`<strong>`__
```

在 MWeb 中的快捷键为： `CMD + U`、`CMD + I`、`CMD + B`
效果如下：

*这些文字会生成`<em>`*
_这些文字会生成`<u>`_

**这些文字会生成`<strong>`**
__这些文字会生成`<strong>`__

## 换行

四个及以上空格加回车。
如果不想打这么多空格，只要回车就为换行，请勾选：`Preferences` - `Themes` - `Translate newlines to <br> tags`

## 列表

### 无序列表

Markdown 语法：

```markdown
* 项目一 无序列表 `* + 空格键`
* 项目二
* 项目二的子项目一 无序列表 `TAB + * + 空格键`
* 项目二的子项目二
```

在 MWeb 中的快捷键为： `Option + U`
效果如下：

* 项目一 无序列表 `* + 空格键`
* 项目二
* 项目二的子项目一 无序列表 `TAB + * + 空格键`
* 项目二的子项目二

### 有序列表

Markdown 语法：

```markdown
1. 项目一 有序列表 `数字 + . + 空格键`
2. 项目二 
3. 项目三
1. 项目三的子项目一 有序列表 `TAB + 数字 + . + 空格键`
2. 项目三的子项目二
```

效果如下：

1. 项目一 有序列表 `数字 + . + 空格键`
2. 项目二 
3. 项目三
1. 项目三的子项目一 有序列表 `TAB + 数字 + . + 空格键`
2. 项目三的子项目二

### 任务列表（Task lists）

Markdown 语法：

```markdown
- [ ] 任务一 未做任务 `- + 空格 + [ ]`
- [x] 任务二 已做任务 `- + 空格 + [x]`
```

效果如下：

- [ ] 任务一 未做任务 `- + 空格 + [ ]`
- [x] 任务二 已做任务 `- + 空格 + [x]`

## 图片

Markdown 语法：

```markdown
![GitHub set up](http://zh.mweb.im/asset/img/set-up-git.gif)
格式: ![Alt Text](url)
```

`Control + Shift + I` 可插入Markdown语法。
如果是 MWeb 的文档库中的文档，还可以用拖放图片、`CMD + V` 粘贴、`CMD + Option + I` 导入这三种方式来增加图片。
效果如下：

![GitHub set up](http://zh.mweb.im/asset/img/set-up-git.gif)

MWeb 引入的特别的语法来设置图片宽度，方法是在图片描述后加 `-w + 图片宽度` 即可，比如说要设置上面的图片的宽度为 140，语法如下：

![GitHub set up-w140](http://zh.mweb.im/asset/img/set-up-git.gif)

## 链接

Markdown 语法：

```markdown
email <example@example.com>
[GitHub](http://github.com)
自动生成连接  <http://www.github.com/>
```

`Control + Shift + L` 可插入Markdown语法。
如果是 MWeb 的文档库中的文档，拖放或`CMD + Option + I` 导入非图片时，会生成连接。
效果如下：

Email 连接： <example@example.com>
[连接标题Github网站](http://github.com)
自动生成连接像： <http://www.github.com/> 这样

## 区块引用

Markdown 语法：

```markdown
某某说:
> 第一行引用
> 第二行费用文字
```

`CMD + Shift + B` 可插入Markdown语法。
效果如下：

某某说:
> 第一行引用
> 第二行费用文字

## 行内代码

Markdown 语法：

```markdown
像这样即可：`<addr>` `code`
```

`CMD + K` 可插入Markdown语法。
效果如下：

像这样即可：`<addr>` `code`

## 多行或者一段代码

Markdown 语法：

    ```js
    function fancyAlert(arg) {
        if(arg) {
        $.facebox({div:'#foo'})
        }
    
    }
    ```

`CMD + Shift + K` 可插入Markdown语法。
效果如下：

```js
function fancyAlert(arg) {
    if(arg) {
    $.facebox({div:'#foo'})
    }

}
```

## 顺序图或流程图

Markdown 语法：

```markdown
    ```sequence
    张三->李四: 嘿，小四儿, 写博客了没?
    Note right of 李四: 李四愣了一下，说：
    李四-->张三: 忙得吐血，哪有时间写。
    ```

    ```flow
    st=>start: 开始
    e=>end: 结束
    op=>operation: 我的操作
    cond=>condition: 确认？

    st->op->cond
    cond(yes)->e
    cond(no)->op
    ```
```
效果如下（ `Preferences` - `Themes` - `Enable sequence & flow chart` 才会看到效果 ）：

```sequence
张三->李四: 嘿，小四儿, 写博客了没?
Note right of 李四: 李四愣了一下，说：
李四-->张三: 忙得吐血，哪有时间写。
```

```flow
st=>start: 开始
e=>end: 结束
op=>operation: 我的操作
cond=>condition: 确认？

st->op->cond
cond(yes)->e
cond(no)->op
```

更多请参考：<http://bramp.github.io/js-sequence-diagrams/>, <http://adrai.github.io/flowchart.js/>

## 表格

Markdown 语法：

```
第一格表头 | 第二格表头
--------- | -------------
内容单元格 第一列第一格 | 内容单元格第二列第一格
内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格
```

效果如下：

第一格表头 | 第二格表头
--------- | -------------
内容单元格 第一列第一格 | 内容单元格第二列第一格
内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格


## 删除线

Markdown 语法：

加删除线像这样用： ~~删除这些~~

效果如下：

加删除线像这样用： ~~删除这些~~

## 分隔线

以下三种方式都可以生成分隔线：

***

*****

- - -

效果如下：

***

*****

- - -



## MathJax

Markdown 语法：

```
块级公式：
$$	x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

\\[ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} =
1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}}
{1+\frac{e^{-8\pi}} {1+\ldots} } } } \\]

行内公式： $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$
```

效果如下（`Preferences` - `Themes` - `Enable MathJax` 才会看到效果）：

块级公式：
$$	x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a} $$

\\[ \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} =
1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}}
{1+\frac{e^{-8\pi}} {1+\ldots} } } } \\]


行内公式： $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$


## 脚注（Footnote）

Markdown 语法：

```
这是一个脚注：[^sample_footnote]
```

效果如下：

这是一个脚注：[^sample_footnote]

[^sample_footnote]: 这里是脚注信息


## 注释和阅读更多

<!-- comment -->
<!-- more -->

Actions->Insert Read More Comment *或者* `Command + .`
**注** 阅读更多的功能只用在生成网站或博客时，插入时注意要后空一行。

## TOC

Markdown 语法：

```
[TOC]
```

效果如下：

[TOC]

