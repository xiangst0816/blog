import React from 'react';

export default function Website({ website }) {
    if (website) {
        return (
            <span className="post-author-website">
                <i className="ic icon-link"></i>
                <a target="_blank" href={website}>Website</a>
            </span>
        );
    }
    return null;
}
