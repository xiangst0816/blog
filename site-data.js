let pathPrefix = '/';
let siteUrl = 'http://xiangsongtao.com';
let trackingId = 'UA-114740261-3';
let faviconUrl = '/favicons/favicon.png';
let start_url = '/';
let shortName = 'xiangst';

if (process.env.CI && process.env.DEPLOY === 'github') {
    pathPrefix = '/blog';
    trackingId = 'UA-114740261-4';
    siteUrl = 'https://xiangsongtao.github.io' + pathPrefix;
    faviconUrl = pathPrefix + faviconUrl;
    start_url = pathPrefix + start_url;
}

module.exports = {
    siteMetadata:{
        title: `Attila`,
        description: `Thoughts, stories and ideas.`, // 网站描述
        keywords: `烈风裘的博客, X-Blog, Attila, Gatsby, 前端成长记录`, // 网站描述
        cover: '/background/kale-salad.jpg',
        tagCover: '/background/asteroids.jpg',
        archiveCover: '/background/alchemy.gif',
        logo: '',
        language: 'zh-CN',
        navigation: true, // 是否开启右侧导航
        subscribe: true, // 是否显示订阅按钮
        siteUrl: siteUrl, // 页面路径
    },

    pathPrefix,
    trackingId,
    faviconUrl,
    start_url,
    shortName,
};
