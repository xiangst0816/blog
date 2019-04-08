import React from "react"

export default function Bio({
  bio,
  count,
  location,
  website,
  twitter,
  facebook,
  github,
  weibo,
}) {
  const res = []
  if (typeof bio !== "undefined" && bio) {
    res.push(
      <p key="bio" className="post-author-about">
        {bio}
      </p>
    )
  }

  if (typeof count !== "undefined") {
    res.push(
      <span key="count" className="post-author-stats">
        <i className="icon icon-pencil" />
        {count === 0
          ? "No Posts"
          : count === 1
          ? `${count} Post`
          : `${count} Posts`}
      </span>
    )
  }
  if (location) {
    res.push(
      <span key="location" className="post-author-location">
        <i className="icon icon-location" />
        {location}
      </span>
    )
  }

  if (website) {
    res.push(
      <span key="website" className="post-author-website">
        <i className="icon icon-link" />
        <a target="_blank" href={website} rel="noopener noreferrer">
          Website
        </a>
      </span>
    )
  }
  if (twitter) {
    res.push(
      <span key="twitter" className="post-author-twitter">
        <i className="icon icon-twitter" />
        <a
          target="_blank"
          href={`https://twitter.com/${twitter}`}
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </span>
    )
  }
  if (facebook) {
    res.push(
      <span key="facebook" className="post-author-facebook">
        <i className="icon icon-facebook" />
        <a
          target="_blank"
          href={`https://facebook.com/${facebook}`}
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      </span>
    )
  }
  if (github) {
    res.push(
      <span key="github" className="post-author-github">
        <i className="icon icon-github" />
        <a target="_blank" href={github} rel="noopener noreferrer">
          Github
        </a>
      </span>
    )
  }
  if (weibo) {
    res.push(
      <span key="weibo" className="post-author-weibo">
        <i className="icon icon-sina-weibo" />
        <a target="_blank" href={weibo} rel="noopener noreferrer">
          Weibo
        </a>
      </span>
    )
  }
  return res
}
