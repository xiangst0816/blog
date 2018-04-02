---
title: 关于组件库的主题定制
author: 烈风裘
date: 2017-12-05T01:23:52.648Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - 组件库
  - 主题
---

### 简述

这篇博文主要讲解**前端组件库主题定制**相关内容，只限于**Scss/Sass、Less**两种样式预处理语言，这两种语言能够简化 CSS 的工作流，使得开发者维护开发样式更得心应手，便于应对复杂的样式需求。

对组件封装性好的库而我比较熟悉的有两个，React 和 Vue，这里我对这两个前端库封装的组件进行说明，涉及到的组件库包括：[element-ui](http://element-cn.eleme.io)、[iview](https://www.iviewui.com/)、[antd](https://ant.design)、[ionic](https://github.com/ionic-team/ionic)。

### 主题定制分类

组件库的编写者一般都会为开发者设计一些主题样式更换方案，主要是这两类：

1.  复写全部主题样式，一次性引入
2.  通过预处理器注入主题变量

这里对这两类进行说明。

#### 1. 复写全部主题样式

##### SCSS

这个在 PC 端比较常见，比如：[element-ui](http://element-cn.eleme.io/#/zh-CN/component/custom-theme)中的第二个方案，虽然说是改变 SCSS 变量，但还是复写了全部主题样式。项目初始时加载全部组件的样式，这个场景在 PC 端并没有太大的问题。但是从性能优化的角度，并不推荐。

```scss
/* 改变主题色变量 */
$--color-primary: teal;

/* 改变 icon 字体路径变量，必需 */
$--font-path: "../node_modules/element-ui/lib/theme-chalk/fonts";

@import "../node_modules/element-ui/packages/theme-chalk/src/index";
```

##### Less

此外，[iview](https://www.iviewui.com/docs/guide/theme)使用 Less 作为预编译语言，给出的推荐主题定制方案全部都是复写全部主题样式的解决办法，和 element-ui 一致。

```less
@import "~iview/src/styles/index.less";

// Here are the variables to cover, such as:
@primary-color: #8c0776;
```

> 因为 Less 和 Scss 变量作用域定义不一样，上面两个`@import`写法会有些不同，但都是一个意思。

需要注意的是，这种方式已经载入了所有组件的样式，不需要也无法和按需加载插件[babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)或[babel-plugin-component](https://www.npmjs.com/package/babel-plugin-component)的 style 属性一起使用。

#### 2. 通过预处理器注入主题变量

##### Less

这里值得一提的是 Antd 组件库，这是我强烈推荐使用的组件库。它推荐使用[修改主题变量](https://ant.design/docs/react/customize-theme-cn)的方式定制主题，使用了 Less 的 [**modifyVars**](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式来覆盖主题变量。比如将主题挂在`package.json`上：

```json
"theme": {
  "primary-color": "#1DA57A",
},
```

这个方案之前在我做的项目中有使用，自己根据实现原理写逻辑代码不是很难。

问题点是：每次修改变量都需要重启 dev 服务，刚开始对开发者不是很友好。当然，主题修改好后，并不是经常变动，这里可以原谅。

##### SCSS

其实 SCSS 也能通过**只修改主题变量**的方式更改主题，这个是在读 IONIC 源码时发现的，[源码位置](https://github.com/ionic-team/ionic-app-scripts/blob/427e556460265da817a5975567ded2a00e5cb8bd/src/sass.ts#L137)。它是通过[node-sass](https://github.com/sass/node-sass)的[**options.data**](https://github.com/sass/node-sass#data)的方式覆盖主题。比如传入如下字符串：

```scss
'@charset "UTF-8"; @import "/xxx/xxx/project/to/theme/path/variables.scss";'
```

构建时启用你定义的样式变量。我这里简单写了一个变量获取方式，[代码](https://github.com/vm-component/vimo/blob/master/examples/build/get-scss-variables.js)。

注意，这里需要你样式组件中的所有变量后都带上`!default`修饰，将生效等级降为最低。这里没有 Less 那样需要重启 dev-server 的问题，通过 webpack 构建，修改了引入的主题文件，项目将自动重构，较为方便。

### 总结

建议通过修改变量的方式来修改主题我认为是比较靠谱的，当主题与公司 UI 不符时，再使用样式复写的方式处理。

> 个人还是比较喜欢 SCSS 的处理方式。
