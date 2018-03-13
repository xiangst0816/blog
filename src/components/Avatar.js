import React from 'react';
import Img from "gatsby-image"
export default function Avatar({ avatar, name }) {
    return (
        <figure className="post-author-avatar avatar">
            {
                avatar && (<img src={avatar} alt={name} />)
            }
        </figure>
    );
}
