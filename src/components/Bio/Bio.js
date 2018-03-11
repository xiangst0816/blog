import React from 'react';

export default function Bio({ bio }) {
    if (bio) {
        return (<p className="post-author-about">{bio}</p>);
    }
    return null;
}
