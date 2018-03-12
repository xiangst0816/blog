import React from 'react';

export default function Weibo({ weibo }) {
    if (weibo) {
        return (
            <span className="post-author-weibo">
                <i className="icon icon-sina-weibo"></i>
                <a target="_blank" href={weibo}>Weibo</a>
            </span>
        );
    }
    return null;
}
