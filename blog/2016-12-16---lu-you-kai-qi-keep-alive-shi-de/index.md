---
title: 路由开启keep-alive时的注意点
author: 烈风裘
date: 2016-12-16T08:14:38.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Vue
---

这个不是业务的要求，但是看到每次进入页面就重新渲染 DOM 然后再获取数据更新 DOM，觉得作为一个前端工程师有必要优化下的加载逻辑，正好 vue 提供了`keep-alive`的功能，所以就试用了下。当然，干任何事儿都不会一帆风顺的，在路上的磕磕碰碰在所难免，故在此记录下遇到的问题，希望看到这篇文章的人能有所帮助。ps：这个也没多难。

HTML 部分：

```html
<template>
  <div class="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
```

JavaScript 部分：

```javascript
.....

    created: function () {
      console.log(1)
    },
    mounted: function () {
      console.log(2)
    },
    activated: function () {
      console.log(3)
    },
    deactivated: function () {
      console.log(4)
    }

.....
```

## 1. 什么阶段获取数据

页面生命周期钩子如上面的代码所示，这四个是最常用到的部分。这部分需要注意下，当引入`keep-alive`的时候，页面第一次进入，钩子的触发顺序 created-> mounted-> activated，退出时触发 deactivated。当再次进入（前进或者后退）时，只触发 activated。

我们知道`keep-alive`之后页面模板第一次初始化解析变成 HTML 片段后，再次进入就不在重新解析而是读取内存中的数据，即，只有当数据变化时，才使用 VirtualDOM 进行 diff 更新。故，页面进入的数据获取应该在 activated 中也放一份。数据下载完毕手动操作 DOM 的部分也应该在 activated 中执行才会生效。

所以，应该 activated 中留一份数据获取的代码，或者不要 created 部分，直接将 created 中的代码转移到 activated 中。

## 2. `$route`中的数据读不到

以前的写法是在 data 中将需要的`$route`数据进行赋值，便于其余方法使用，但是使用了`keep-alive`后数据需要进入页面在 activated 中再次获取，才能达到更新的目的。定义一个 initData 方法，然后在 activated 中启动。

```javascript
initData: function () {
        let _this = this;
        _this.fromLocation = JSON.parse(this.$route.query.fromLocation);
        _this.toLocation = JSON.parse(this.$route.query.toLocation);
        _this.activeIndex = parseInt(this.$route.params.activeIndex) || 0;
        _this.policyType = parseInt(this.$route.params.policyType) || 0;
      },
```

## 3. 当页动态修改 url

需求描述：当页面在进行轮播操作的时候希望能记录当前显示的轮播 ID(activeIndex)。当进入下一个页面再返回的时候能记住之前的选择，将轮播打到之前的 ID 位置。所以我想将这部分信息固化在 url 中，轮播发生变化时，修改 URL。这样实现比较符最小修改原则，其余页面不用变动。

之前的写法是将 activeIndex 放在`$route`的 query 中，当轮播后，将
activeIndex 的值存入`$route.query.activeIndex`中，然后`$router.replace`当前路由，理论上应该能发生变化，但实际没有。

查看文档后说，`$route`是只读模式。当然，对象部分是他监管不到的，我修改了并不是正统的做法。

**神奇的地方来了**：当我将 activeIndex 记在 params 中，轮播变动修改 params 中的参数，然后`$router.replace`当前路由，却能发生对应的变化。代码如下：

```javascript
let swiperInstance = new Swiper("#swiper", {
  pagination: ".swiper-pagination",
  paginationClickable: false,
  initialSlide: activeIndex,
  onSlideChangeEnd: function(swiper) {
    let _activeIndex = swiper.activeIndex;
    _this.$route.params.activeIndex = _activeIndex;
    // $router我放到了window上方便调用
    window.$router.replace({
      name: _this.$route.name,
      params: _this.$route.params,
      query: _this.$route.query
    });
    // 根据activeIndex，在这里初始化下面显示的数据
    _this.transferDetail = _this.allData.plans[_activeIndex].segments;
    _this.clearBusDetailFoldState();
  }
});
```

## 4. 事件如何处理

估计你也能猜到，发生的问题是事件绑定了很多次，比如上传点击 input 监听 change 事件，突然显示了多张相同图片的问题。

也就是说，DOM 在编译后就缓存在内容中了，如果再次进入还再进行事件绑定初始化则就会发生这个问题。

解决办法：在 mounted 中绑定事件，因为这个只执行一次，并且 DOM 已准备好。如果插件绑定后还要再执行一下事件的 handler 函数的话，那就提取出来，放在 activated 中执行。比如：根据输入内容自动增长 textarea 的高度，这部分需要监听 textarea 的 input 和 change 事件，并且页面进入后还要再次执行一次 handler 函数，更新 textarea 高度（避免上次输入的影响）。

## 5. 地图组件处理

想必这是使用`keep-alive`最直接的性能表现。之前是进入地图页面后进行地图渲染+线路标记；现在是清除以前的线路标记绘制新的线路，性能优化可想而知！

我这里使用的是高德地图，在 mounted 中初始化 map，代码示例如下：

```javascript
export default {
  name: "transferMap",
  data: function() {
    return {
      map: null
    };
  },
  methods: {
    initData: function() {},
    searchTransfer: function(type) {},
    // 地图渲染 这个在transfer-map.html中使用
    renderTransferMap: function(transferMap) {}
  },
  mounted: function() {
    this.map = new AMap.Map("container", {
      showBuildingBlock: true,
      animateEnable: true,
      resizeEnable: true,
      zoom: 12 //地图显示的缩放级别
    });
  },
  activated: function() {
    let _this = this;
    _this.initData();
    // 设置title
    setDocumentTitle("换乘地图");
    _this.searchTransfer(_this.policyType).then(function(result) {
      // 数据加载完成
      // 换乘地图页面
      let transferMap = result.plans[_this.activeIndex];
      transferMap.origin = result.origin;
      transferMap.destination = result.destination;
      // 填数据
      _this.transferMap = transferMap;
      // 地图渲染
      _this.renderTransferMap(transferMap);
    });
  },
  deactivated: function() {
    // 清理地图之前的标记
    this.map.clearMap();
  }
};
```

## 6. document.title 修改

这个不是`keep-alive`的问题，不过我也在这里分享下。

问题是，使用下面这段方法，可以修改 Title，但是页面来回切换多次后就不生效了，我也不知道为啥，放到 setTimeout 中就直接不执行。

```
document.title = '页面名称';
```

下面是使用 2 种环境的修复方法：

纯 js 实现

```javascript
function setDocumentTitle(title) {
  "use strict";
  //以下代码可以解决以上问题，不依赖jq
  setTimeout(function() {
    //利用iframe的onload事件刷新页面
    document.title = title;
    var iframe = document.createElement("iframe");
    iframe.src = "/favicon.ico"; // 必须
    iframe.style.visibility = "hidden";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.onload = function() {
      setTimeout(function() {
        document.body.removeChild(iframe);
      }, 0);
    };
    document.body.appendChild(iframe);
  }, 0);
}
```

jQuery/Zepto 实现

```javascript
function setDocumentTitle(title) {
  //需要jQuery
  var $body = $("body");
  document.title = title;
  // hack在微信等webview中无法修改document.title的情况
  var $iframe = $('<iframe src="/favicon.ico"></iframe>');
  $iframe
    .on("load", function() {
      setTimeout(function() {
        $iframe.off("load").remove();
      }, 0);
    })
    .appendTo($body);
}
```

以上内容的更新请查看我的博客，[点这里](http://xiangsongtao.com/article/5853b2c0044bf1353af82fbf)。

(完)
