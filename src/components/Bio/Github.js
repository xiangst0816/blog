import React from 'react';

export default function Github({ github }) {
    if (github) {
        return (
            <span className="post-author-github">
                <i className="ic ic-github"></i>
                <a target="_blank" href={github}>Github</a>
            </span>
        );
    }
    return null;
}
