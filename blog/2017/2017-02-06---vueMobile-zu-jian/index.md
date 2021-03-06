---
title: vueMobile组件(组件间通讯)
author: 烈风裘
date: 2017-02-06T05:22:14.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Vue
  - Mobile
  - 组件通信
---

移动端组件的编写和 PC 端组件的编写是不同的，PC 端组件见的通讯及状态共享很简单，基本上井水不犯河水，但是移动端组件的却不是这样：ion-title 组件希望共享自己的控制权，便于业务动态修改、menu 组件弹开的手，希望页面也能向右移动下、页面切换的时候，自动关闭 ActionSheet 组件等。下面是我在组件编写时踩得坑，如果感兴趣或者有同样的思考可以和我联系。

## 组件间通讯

基础组件的组件见通讯使用的比较多，比如 menu 组件打开需要通知 nav 组件是否移动等，如果直接上 Vuex，基础组件间的通讯与业务逻辑的通讯将混为一起，不方便开发调试。另外，项目是否上 Vuex 也是未知数，所以这里确定：vueMobile 组件间通讯走 EventBus，业务间状态同步是否上 Vuex 根据规模选择使用。这也算是自己编写组件前一致坚持的：

> 我想在编写业务页面的时候，能清爽一点。

下图是简单的机构说明：

![]()

## 公共组件方法提取

基础组件通过 Vue.install 安装到全局，但是组件中的某些方法是需要在业务代码中直接调用的，比如控制页面是否能滚动、是否能点击、设置标题、返回顶部等方法。另一方面，组件在注册返回的始终是构造器，而不是`鲜活的`组件实例：

```
// 获取注册的组件（始终返回构造器）
var MyComponent = Vue.component('my-component')
```

也就是说：**组件只有被页面初始化的时候才会存在生命，才存在这个组件内部的 this**。

### 子组件希望共享对自己的控制权，这个怎么做？

比如业务页面中的`ion-title`组件自身实现了`setTitle`方法来控制 Title 的显示，但是这个方法希望在业务页面中能调用，方便用户自定义 Title(包括修改 document.title 的 Hack 方法)。例如如下的结构：

```jsx
<ion-page>
  <ion-header>
    <ion-navbar>
      <ion-title slot="content">Demo</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <h1>content</h1>
  </ion-content>
</ion-page>
```

这样的需求实现有两个方法：

1.  **在业务 this 中找到子组件的 this**：在业务页面的 this 通过逐层查找$children 中 ion-title 组件，然后执行找到的组件的 child.setTitle(val)方法。
2.  **子组件将自己放到全局**：ion-title 组件初始化时，向全局挂载，比如挂载到 Vue 的 prototype 上：`Vue.prototype.setTitle=ins.setTitle`；或者挂载到 window 上。当页面切换后，需要重复此操作。挂载到 Vue 上，业务页面可以通过 this 访问到，并且页面模板也能直接使用，较为方便。

另外，路由开启`keep-alive`时，组件也能正常工作的情况别忘记考虑，此时页面切换只有`activated/deactivated`钩子工作，业务内的组件不会因为外面是`keep-alive`而自我更新的，相当于变成了**墓碑**。

此外，`ion-page`外层的`ion-app/ion-nav`是所有业务页面公用的，每次业务页面切换再提取父组件的内容可能不太合适。

因此，vueMobile 组件是这样做的：

1.  业务页面的子组件使用 mixins 遍历 this 提取公共方法，提取方法在 created 和 activated 钩子上都注册方法，挂载前判断是否已挂载；
2.  业务页面的父组件使用 Vue.prototype 将自己挂载到全局上。

下面是对这个过程的说明：

![]()

## Backdrop 组件

同时打开两个带有 Backdrop 的 Loading 组件，这个该怎么显示呢？答案是只显示一次 Backdrop！因此 Backdrop 组件的设计需要脱离 Loading、Toast、ChooseSheet 等组件。

## ChooseSheet 组件

其实这个组件是 ActionSheet 的变种，因为此组件的展现样式被发现在多处被使用到，比如：Timepicker、购物车、选择商品尺码、选择地址等。
