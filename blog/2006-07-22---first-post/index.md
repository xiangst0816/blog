---
title: First Post
author: Evan You
date: "2006-07-22T22:39:53.000Z"
updated: "2006-07-24T22:39:53.000Z"
layout: post
draft: false
comments: true
permalink: /post/xxxxx-xxxx-xxx/
cover: http://img.zcool.cn/community/01504759302776a8012193a30f85f1.jpg@1280w_1l_2o_100sh.webp
tags:
  - Getting Started
  - Learning
  - writing
  - 协作
---

![ken-treloar-369039.jpg](/ken-treloar-369039.jpg)
![redd-angelo-370362.jpg](/redd-angelo-370362.jpg)

A small confession on my part, I love reading blogs. I've been reading blogs for quite a while now, five years I'd suppose. It has been my privilege during this time to read the discussions and thoughts of hundreds of different intelligent and opinionated blog authors from all around the earth. I'm in college now, this fall will be my Junior year. Everyday I listen to lecture and read from textbooks and most don't hold a candle to my daily dose of blog `news` and `analysis`. 

![Hello World](https://drscdn.500px.org/photo/248289243/q%3D80_m%3D2000/v2?webp=true&sig=800f135a516a82c88f462087e24ab1500e6c241a729a76adb93d1405be98151b)

善我王上魚、產生資西員合兒臉趣論。畫衣生這著爸毛親可時，安程幾？合學作。觀經而作建。都非子作這！法如言子你關！手師也。

以也座論頭室業放。要車時地變此親不老高小是統習直麼調未，行年香一？

![background/4.jpg](/4.jpg)


就竟在，是我童示讓利分和異種百路關母信過明驗有個歷洋中前合著區亮風值新底車有正結，進快保的行戰從：弟除文辦條國備當來際年每小腳識世可的的外的廣下歌洲保輪市果底天影；全氣具些回童但倒影發狀在示，數上學大法很，如要我……月品大供這起服滿老？應學傳者國：山式排只不之然清同關；細車是！停屋常間又，資畫領生，相們制在？公別的人寫教資夠。資再我我！只臉夫藝量不路政吃息緊回力之；兒足灣電空時局我怎初安。意今一子區首者微陸現際安除發連由子由而走學體區園我車當會，經時取頭，嚴了新科同？很夫營動通打，出和導一樂，查旅他。坐是收外子發物北看蘭戰坐車身做可來。道就學務。

國新故。

> 工步他始能詩的，裝進分星海演意學值例道……於財型目古香亮自和這乎？化經溫詩。只賽嚴大一主價世哥受的沒有中年即病行金拉麼河。主小路了種就小為廣不？


*From [亂數假文產生器 - Chinese Lorem Ipsum](#)*

私は昨日ついにその助力家というのの上よりするたなけれ。

最も今をお話団はちょうどこの前後なかろでくらいに困りがいるたをは帰着考えたなかって、そうにもするでうたらない。

がたを知っないはずも同時に九月をいよいよたありた。

もっと槙さんにぼんやり金少し説明にえた自分大した人私か影響にというお関係たうませないが、この次第も私か兄具合に使うて、槙さんののに当人のあなたにさぞご意味と行くて私個人が小尊敬を聴いように同時に同反抗に集っだうて、いよいよまず相当へあっうからいだ事をしでなけれ。

```js
import React from 'react';
import classNames from 'classnames';
import registerListener from 'tp-register-listener';

// Create Author pages.
function createAuthorPage(edges, createPage) {
    const authorPage = path.resolve('src/templates/author-page.js');
    edges.forEach(edge => {
        createPage({
            path: `/author/${kebabCase(edge.node.id)}`, // required
            component: authorPage,
            context: {
                author: edge.node.id,
            },
        });
    });
}

// Create blog posts pages.
function createBlogPost(edges, createPage) {
    const blogPost = path.resolve('src/templates/blog-post.js');
    edges.forEach((edge, index) => {
        const { slug } = edge.node.fields;
        const prev = index === 0 ? '' : edges[index - 1].node.fields.slug;
        const next = index === edges.length - 1 ? '' : edges[index + 1].node.fields.slug;
        createPage({
            path: slug, // required
            component: blogPost,
            context: {
                curr: slug,
                prev,
                next,
            },
        });
    });
}
```

## Gist

## jsFiddle

lorem   


<iframe width="100%" height="300" src="//jsfiddle.net/Aflier/pehfos3e/embedded/" allowpaymentrequest allowfullscreen="allowfullscreen" frameborder="0"></iframe>

`jsFiddle: //jsfiddle.net/Aflier/pehfos3e/embedded/`

## Video

**youku iframe**

<iframe height=300 width=510 src='http://player.youku.com/embed/XMjkxODkzNzI2NA==' frameborder=0 'allowfullscreen'></iframe>


**video: https://www.youtube.com/embed/2Xc9gXyf2G4**

`video: https://www.youtube.com/embed/2Xc9gXyf2G4`

**youtube: https://www.youtube.com/watch?v=2Xc9gXyf2G4**

`youtube: https://www.youtube.com/watch?v=2Xc9gXyf2G4` 

**youtube: 2Xc9gXyf2G4**

`youtube: 2Xc9gXyf2G4`

**vimeo: https://vimeo.com/5299404**

`vimeo: https://vimeo.com/5299404`

**vimeo: 5299404**

`vimeo: 5299404`

**videoPress: https://videopress.com/v/kUJmAcSf**

`videoPress: https://videopress.com/v/kUJmAcSf`

**videoPress: kUJmAcSf**

`videoPress: kUJmAcSf`


## emo



😆 🚀 🎉 🚄 🚗 🚴 🍎 🍑

The blog is the greatest conversational tool ever invented because seconds after I click publish for this post, it can be read across the world by thousands. Granted, this blog, along with most of the other [100 million][0] blogs in existence, won't be read much. But that's all right. Conversation is fun, even it's just with a few of your buds. I'm just happy to join the party.



## Match

$a^2 + b^2 = c^2$

$$
a^2 + b^2 = c^2
$$

[0]: http://www.blogherald.com/2005/10/10/the-blog-herald-blog-count-october-2005/
