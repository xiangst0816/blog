import React from 'react';

export default function Avatar({ avatar, name }) {
    return (
        <figure className="post-author-avatar avatar">
            {
                avatar && (<img src={avatar} alt={name} />)
            }
        </figure>
    );
}
