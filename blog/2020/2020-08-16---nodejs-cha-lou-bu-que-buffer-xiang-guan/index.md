---
title: Nodejs查漏补缺-Buffer相关
author: 烈风裘
date: 2020-08-16T15:47:58.666Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - Node
---

### 1. 新建Buffer会占用V8分配的内存吗？

不会，Buffer属于堆外内存，不是V8分配的



### 2. Buffer的内存分配机制

Buffer对象类似数组，它的元素为16进制的两位数，即0到255的数值。**其内存分配是在Node的C++层面实现的内存的申请，但是在JavaScript层面分配内存**。Node采用了**slab分配机制**，以**8KB**为界限区分Buffer是大对象还是小对象。

**小对象（<8KB）：**

采用slab的机制进行预先申请和事后分配的策略。例如第一次分配一个1024字节的Buffer，Buffer.alloc(1024)，那么这次分配就会用到一个slab，接着如果继续Buffer.alloc(1024)，那么上一次用的slab的空间还没有用完，因为总共是8kb，1024+1024 = 2048个字节，没有8kb，所以就继续用这个slab给Buffer分配空间。如果下次超过剩余空间，则重新申请一个新的slab存数据。

**大对象（>8KB）：**

直接分配一个SlowBuffer对象作为slab单元，这个slab单元会被这个大Buffer对象独占。



### 3. Buffer与String的关系

Buffer是二进制数据，字符串与Buffer之间存在编码关系，通过setEncoding方式进行转码。但是Node的Buffer支持的编码类型有限，需要借助iconv等工具进行拓展。

