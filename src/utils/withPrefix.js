export default function withPrefix(url) {
    return url.charAt(0) !== '/' ? `/${url}` : url;
}
