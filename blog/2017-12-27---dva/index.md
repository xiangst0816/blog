---
title: dva
author: 烈风裘
date: 2017-12-27T09:38:58.015Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - React
---

### 路由部分

以下是`dva/router`的导出项:

```js
import {
  routerRedux,
  Router,
  Switch,
  Route,
  Redirect,
  Link,
  NavLink
} from "dva/router";
```

#### routerRedux

dva 中的源码如下:

```js
module.exports.routerRedux = require("react-router-redux");
```

routerRedux 是对`react-router-redux`的导出, 自身的初始化已在 dva 中完成, 一般用在非 RouteComponent 页面(不是函数式组件), 比如:

- PC 组件内
- 外部库
- modals
- 函数式组件

这样使用:

```js
dispatch(routerRedux.push("/form/step-form"));
```

RouteComponent 组件可以直接在`this.props`中拿到.

#### `<Router history:History>`

`<Router>`组件源自`react-router`插件, 按照源码的说明:

> The public API for putting history on context.

也就是说, 将传入的`history`实例通过 React 组件的形式注入 context 中, 以便于子组件通过 context 拿到 router 信息, 这里的`router`结构信息如下:

```js
{
	history: this.props.history,
	route: {
    		location: this.props.history.location,
    		match: this.state.match
	}
}
```

这里需要注意的是, 传入的 history 是特意化的 history 实例, 比如这三类:

- createBrowserHistory
- createMemoryHistory
- createHashHistory

因此, 在 dva 中不再需要`<BrowserRouter>`, `<HashRouter>`, `<MemoryRouter>`三个组件, 这里不再解释.

对于在组件树中的组件, 通过以下方式就能拿到路由信息:

```js
class Analysis extends Component {
  // ...
  render() {
    let router = this.context.router;
  }
}

Analysis.contextTypes = {
  router: PropTypes.object
};
```

> ps: react-router 就是对 history 的再次封装

#### `<Switch>`

只渲染出第一个与当前访问地址匹配的 `<Route>` 或 `<Redirect>`。

#### `<Redirect to:string|object from:string push:boolean>`

渲染时将导航到一个新地址，这个新地址覆盖在访问历史信息里面的本该访问的那个地址。

#### `<Route component | render | children path: string exact: bool strict: bool>`

它最基本的职责就是当页面的访问地址与 Route 上的 path 匹配时，就渲染出对应的 UI 界面。即: 页面插入点.

#### `<Link>`

为你的应用提供声明式，无障碍导航。

- to: string
- replace: bool

#### `<NavLink>`

这是 <Link> 的特殊版，顾名思义这就是为页面导航准备的。因为导航需要有 “激活状态”。

- activeClassName: string
- exact: bool
- strict: bool
- isActive: func

## 参考文章

- [初探 React Router 4.0](http://blog.csdn.net/sinat_17775997/article/details/69218382)
