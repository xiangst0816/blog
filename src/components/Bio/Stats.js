import React from 'react';

export default function Stats({ count }) {
    return (
        <span className="post-author-stats">
                <i className="ic ic-pencil"></i>
            {
                count === 0 ? ('No Posts') : (count === 1 ? (`${count} Post`) : (`${count} Posts`))
            }
        </span>
    );
}
