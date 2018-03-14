import React from 'react';
// import Img from "gatsby-image"
import { withPrefix } from "gatsby-link";

export default function Avatar({ avatar, name }) {
    return (
        <figure className="post-author-avatar avatar">
            {
                avatar && (<img src={withPrefix(avatar)} alt={name} />)
            }
        </figure>
    );
}
