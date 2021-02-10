let pathPrefix = "/"
let siteUrl = "https://xiangsongtao.com"
let trackingId = "UA-114740261-3"
let faviconUrl = "/favicons/favicon.png"
let start_url = "/"
let shortName = "xiangst"

// cover: '/background/photo-1503197979108-c824168d51a8.jpeg',

if (process.env.CI && process.env.DEPLOY === "github") {
  pathPrefix = "/blog"
  trackingId = "UA-114740261-4"
  siteUrl = "https://xiangst0816.github.io" + pathPrefix
  faviconUrl = faviconUrl
  start_url = (pathPrefix + start_url).replace(/\/\//gi, "/")
}

module.exports = {
  siteMetadata: {
    title: `Attila`,
    description: `Thoughts, stories and ideas.`, // 网站描述
    author: `@烈风裘`,
    keywords: ["烈风裘的博客", "X-Blog", "Attila", "Gatsby", "前端成长记录"], // 网站描述
    cover: "/background/1.jpg",
    // authorCover由author自己定义
    tagCover: "/background/5.jpg",
    archiveCover: "/background/escape-flight.png",
    logo: "",
    language: "zh-CN",
    navigation: true, // 是否开启右侧导航
    subscribe: true, // 是否显示订阅按钮
    siteUrl: siteUrl, // 页面路径
  },

  pathPrefix,
  trackingId,
  faviconUrl,
  start_url,
  shortName,
}
