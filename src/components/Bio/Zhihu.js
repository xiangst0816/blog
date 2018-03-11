import React from 'react';

export default function Zhihu({ zhihu }) {
    if (zhihu) {
        return (
            <span className="post-author-zhihu">
                <i className="ic ic-zhihu"></i>
                <a target="_blank" href={zhihu}>Zhihu</a>
            </span>
        );
    }
    return null;
}
