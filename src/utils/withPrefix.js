import { withPrefix } from 'gatsby-link';

export default function (url) {
    return withPrefix(url.charAt(0) !== '/' ? `/${url}` : url);
}
