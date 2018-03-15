---
title: 前端代码异常监控模块设计
author: 烈风裘
date: 2017-03-09T05:08:25.000Z
draft: false
comments: false
star: false
cover: ''
tags: 
  - 前端监控
---


最近在做VImo前端Hybrid框架编写，基础组件完成的差不多了，在组件模块之外还需要一个日志模块，关于日志模块的设计先从需求开始(自己给自己找需求)，大概是这样：在手机模式下，希望能有一个将代码中以console打印出来的信息显示在这个界面上的模块，包括log、error、warn等信息， 这样方便在手机上调试能看到错误信息，或者是log信息。

因此，第一版的做法估计大家都会，拦截console方法， 将arguments信息转存到一个数组，然后将数组中的数据显示在这个界面上。界面用js动态生成，然后内容append到body里面就好，难度不大。

但是，仔细一想，这个是有问题的：既然我都拦截了console，如果我想统计error信息，并将错误信息发送到异常监控平台，也许又是一顿改；或者PM给了另一个需求：将监控用户行为的代码埋点发送到处理埋点的平台，也许又要加班了。

```
try{
	helloWord()
}catch(err){
	sendReport(err)
}

var res = {
	// ...
	fail:function(){
		console.error('Can not find data! getUser.js::<Function>findMethod')
	}
}
```

这里需要解释下埋点，乍一看，这个好像和拦截console没关系，我们需要换个角度来看下：一般定制化的统计都是需要定向埋点的，这就需要监听目标位置触发的事件，然后执行埋点程序，像下面这样：

```
$here.click(function(){
	userEvent.send('hereClick-1')
})
```

发送使用的是ajax还是图片这个由业务自己选择，本质上也是一个单向的数据传递，这个和发送页面异常信息是一样，可以理解成“我埋了一个错误”，呵呵。



将共性提取出来，就是下面这个的图：

![]()

我们可以将网页看做一个分布式不连续的类App应用，当然，SPA单页应用会更纯粹一些。应用对外信息操作分为两类：

1. 双向通信：比如Ajax数据请求，或者发送数据
2. 单向传递状态信息：错误异常监控、埋点等

因此，这里涉及的日志模块就是为第二类准备的，功能清单如下：

1. 拦截console方法，如果是error、warn、assert方法则提取错误信息，一般为string
2. $log服务添加自定义的error、warn、assert方法，可以传递更为复杂的错误对象
3. 对传入的错误信息进行归一化，try/catch和onerror的错误属性是不一样的，这里需要统一
4. 埋点的实现方法和$log完全相同



将前端的代码当做一个分布式的类App

## App对外通信方式

### http请求

### App日志

普通日志(log/debug/info)+异常日志(error/assert/warn)+埋点信息(analystics)

移动端需要将日志搜集显示在手机屏幕上的需求

普通的日志使用方式(显示级别不一样):

```
$log.log('message');
$log.info('message');
$log.debug('message');
```

异常的日志使用方式:

```
$log.warn('message', 'position');
$log.error('message', 'position');
$log.assert(isFalse, 'message', 'position');
$log.assert(isFalse, 'message', './src/test.js::<Function>testMethod');

```






## 异常搜集方式

### 主动发送

用于逻辑错误或状态错误.

在代码中的异常位置手写记录代码:

```
{
	fail:function(){
		$log.error('无法得到服务器数据', './src/test.js <Function>testMethod')
	}
}
```


### try/catch

能不捕获的异常有7类,:

1. SyntaxError: 语法错误
2. ReferenceError: 引用错误 要用的东西没找到
3. RangeError: 范围错误  专指参数超范围
4. TypeError: 类型错误  错误的调用了对象的方法
5. EvalError: eval()方法错误的使用
	与url相关函数参数不正确，主要是encodeURI()、decodeURI()、
	encodeURIComponent()、decodeURIComponent()、escape()和unescape()这六个函数。
	eg: decodeURI('%2')
	Uncaught URIError: URI malformed
6. URIError: url地址错误
	eval函数没有被正确执行
7. 执行ifream中的方法
8. json.parse()
9. 外部定义的变量, 比如hrbyid中定义的全局属性及方法

1-4在开发过程中避免,
5-8需要代码运行时判断(try/catch)


```
try{
	// ....code
}catch(err){
	$log.error('无法执行代码', './src/test.js::<Function>testMethod', err)
}
```

### window.onerror



## 异常搜集问题点

1. Script error 跨域问题. -> "Script error.",
2. try/catch, window.onerror -> 压缩代码无法定位(由本地$log接管封装)
3. window.onerror只能有一个
4. 采样率(大PV的情况下)
5. try/catch, window.onerror返回的参数需要归一化
6. error不同途径的参数丢失
7. message在console中的展示形式


## 支持单页SPA也支持多页

localstroage中备份, 初始化时先检查是否有备份. 注意3Mb的限制



## 关于埋点

这里使用的是定向侵入式埋点.

这类的埋点都是由事件触发: performance/pointer(click/touch)/scroll/setTimeout/自定义(swiper/goBack/appLoad/appExit/), 触发之后发送log信息:

```
$analytics('type', id)
```

如果是pointer类事件, 则在dom中添加属性: data-analytics-id="_id", _id这部分可以通过Vuex全局维护(类似于i18n)








