import React from 'react';

export default function Bio({ bio, count, location, website, twitter, facebook, github, weibo }) {
    const res = [];
    if (typeof bio !== 'undefined' && bio) {
        res.push(<p className="post-author-about">{bio}</p>);
    }

    if (typeof count !== 'undefined') {
        res.push(
            <span className="post-author-stats">
                <i className="icon icon-pencil"></i>
                {
                    count === 0 ? ('No Posts') : (count === 1 ? (`${count} Post`) : (`${count} Posts`))
                }
        </span>
        );
    }
    if (location) {
        res.push(
            <span className="post-author-location">
                <i className="icon icon-location"></i>
                {location}
            </span>
        );
    }

    if (website) {
        res.push(
            <span className="post-author-website">
                <i className="icon icon-link"></i>
                <a target="_blank" href={website}>Website</a>
            </span>
        );
    }
    if (twitter) {
        res.push(
            <span className="post-author-twitter">
                <i className="icon icon-twitter"></i>
                <a target="_blank" href={`https://twitter.com/${twitter}`}>Twitter</a>
            </span>
        );
    }
    if (facebook) {
        res.push(
            <span className="post-author-facebook">
                <i className="icon icon-facebook"></i>
                <a target="_blank" href={`https://facebook.com/${facebook}`}>Facebook</a>
            </span>
        );
    }
    if (github) {
        res.push(
            <span className="post-author-github">
                <i className="icon icon-github"></i>
                <a target="_blank" href={github}>Github</a>
            </span>
        );
    }
    if (weibo) {
        res.push(
            <span className="post-author-weibo">
                <i className="icon icon-sina-weibo"></i>
                <a target="_blank" href={weibo}>Weibo</a>
            </span>
        );
    }
    return res;
}
