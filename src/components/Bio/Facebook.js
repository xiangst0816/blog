import React from 'react';

export default function Facebook({ facebook }) {
    if (facebook) {
        return (
            <span className="post-author-facebook">
                <i className="ic ic-facebook"></i>
                <a target="_blank" href={`https://facebook.com/${facebook}`}>Facebook</a>
            </span>
        );
    }
    return null;
}
