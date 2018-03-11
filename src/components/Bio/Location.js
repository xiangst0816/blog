import React from 'react';

export default function Location({ location }) {
    if (location) {
        return (
            <span className="post-author-location">
                <i className="ic icon-location"></i>
                {location}
            </span>
        );
    }
    return null;
}
