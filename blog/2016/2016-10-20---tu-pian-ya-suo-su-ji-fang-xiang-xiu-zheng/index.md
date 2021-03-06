---
title: 图片压缩及方向修正
author: 烈风裘
date: 2016-10-20T14:12:12.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - 图片压缩
  - 图片修正
---

### 先描述下问题

Webapp 在上传图片的时候，会出现旋转 90° 的问题，但是在上传前预览图片是没问题的。这是因为什么呢？

原因在这边博客中说的很清楚了，[查看这里：移动端 Web 上传图片实践](https://github.com/xiangpaopao/blog/issues/7)。也就是说，对于 IOS 或者上传数码相机拍摄的图片时，为了保证快读读写所以就没对图片进行方向矫正，而是使用一个字段 Orientation 保存方向。故对这种情况需要进行图片方向的纠正。

这种问题的修复有两种：

- 第一种方法是**后台修正**，[插件 GraphicsMagick](http://www.graphicsmagick.org/)提供的 API 比较友好，在控制台输入`npm install gm`进行安装，简单实用如下：

```
gm('/path/to/img.jpg')
.autoOrient()
.resize(240, 240)
.write('/path/to/new.jpg', function (err) {
  if (err) ...
})
```

- 第二种方法是**前台修正**，可是使用[canvasResize 插件](https://github.com/gokercebeci/canvasResize)，我比较倾向于实用第二种，因为将计算量分布到各个终端，减轻服务器压力。

主要代码如下：

```
var file = input.files[0];
canvasResize(file, {
        width: 300,//如果宽度没到300px则不会进行方法处理
        height: 0,//自适应
        crop: false,
        quality: 100,//图片质量，default 80.
        rotate   : 90,      // Image rotation default 0,如果自动处理则不设置
        callback: function(data, width, height) {
            var blob = canvasResize('dataURLtoBlob', data);
            var form = new FormData();
            form.append('file',blob);
            $.ajax({
                type: 'POST',
                url: server,
                data: form,
                contentType: false,
                processData: false,
            }).done(function (res) {
                ......
            }).fail(function () {
                ......
            }).always(function () {
                ......
            });
        }
});
```

你现在看到的这个博客的所有图片就是采用前台处理的方式进行图片方向矫正及尺寸压缩。**因为使用的 ES6 语法及 VUE 框架，具体代码书写请参我的博客项目**：

- 文件[api_upload.js](https://github.com/xiangsongtao/X-SONGTAO-VUE/blob/master/src/api/api_upload.js) 处理上传的公共服务，其中 EXIF.js 和 canvasResize.js 我做了些模块化修改，请移步具体文件。
- [HTML 及\*.vue 中的使用方法](https://github.com/xiangsongtao/X-SONGTAO-VUE/blob/master/src/views/admin.article.vue)，摘抄如下：

```
<form action="" class="imgUploadForm" method="post" enctype="multipart/form-data">
        <input id="imgUpload" type="file">
</form>
```

```
/**
 * 1. 选择图片,获得filer信息
 * */
$("#imgUpload").change(function (e) {
    // 文件句柄
    var file = e.target.files[0];
    // 只处理图片
    if (!file.type.match('image.*')) {
        return null;
    }
    scope.isImgLoading = true;
    ImageUpload(file).then(function (imageName) {
        scope.uploadImgUrl = addImgPrefix(imageName);
    }, function () {
        alert("upload error");
    }).then(function () {
        scope.isImgLoading = false;
    })
})
```

### 介绍下方法二的思路

1.  监听 input 的 onChange 事件，获取文件句柄（file）
2.  传入 file，使用 canvasResize 进行图片尺寸及方向校准，回调得到 base64 编码的图片信息（data）
3.  将图片改为二进制文件 blob, 准备上传（form）
4.  将得到的 form 进行上传

注：上传到后台的文件需要重命名，因为在转成 blob 时，已不是原来文件了。后台相关处理文件[请转到这里](https://github.com/xiangsongtao/X-SONGTAO/blob/master/app/routes/api.routes.js)，Line:84。

### 最终效果展示

> 效果还是很明显的，上传速度和未处理基本一样，没感觉。

#### 从 iphone 拍摄后未处理的图片(手机上看竖着的，pc 上看是横着的)

- 尺寸：3264\*2448
- 大小 ：1.2MB

![demo](http://xiangsongtao.com/uploads/1471425020000.jpg "未处理")

---

#### 上传前处理后的图片

- 尺寸：710\*946
- 大小 ：68KB

![](http://xiangsongtao.com/uploads/1471528805000.jpeg "已处理")

### 最后

> 希望如果有不明白的，请在下方评论或者在 github 提 issue，[我的博客项目](https://github.com/xiangsongtao/X-SONGTAO-VUE)因为还有些小功能未实现，将会一直维护下去，技术问题希望能共同探讨。

#### 参考

- [移动端 Web 上传图片实践 ](https://github.com/xiangpaopao/blog/issues/7)
- [GraphicsMagick](http://www.graphicsmagick.org/)
- [canvasResize](https://github.com/gokercebeci/canvasResize)
