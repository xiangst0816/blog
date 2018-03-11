import React from 'react';

export default function Twitter({ twitter }) {
    if (twitter) {
        return (
            <span className="post-author-twitter">
                <i className="ic icon-twitter"></i>
                <a target="_blank" href={`https://twitter.com/${twitter}`}>Twitter</a>
            </span>
        );
    }
    return null;
}
