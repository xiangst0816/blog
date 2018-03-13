function canScroll() {
    // ios uiwebview 滚动停止才会向外发送事件, 这里会禁止使用
    if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('iphone') > -1 && typeof window.webkit !== 'undefined' && ua.indexOf('safari') === -1) return true;
        if (ua.indexOf('alipay') === -1) return true;
    }
    return false;
}

export default canScroll();
