import React from "react"
import { Link } from "gatsby"
import kebabCase from "lodash.kebabcase"
import classNames from "classnames"
import PropTypes from "prop-types"
import Avatar from "./Avatar"

export default class ExcerptLoop extends React.PureComponent {
  render() {
    const { edges, authorList } = this.props

    return (
      <section>
        {edges &&
          edges.map(edge => {
            const { slug } = edge.node.fields
            const post = edge.node.frontmatter
            const excerpt = edge.node.excerpt
            const authorId = post.author

            const author = authorList.find(item => item.id === authorId)

            if (!author) {
              return null
            }

            const Tags = () => {
              return post.tags
                ? post.tags.map(tag => {
                    return (
                      <span key={tag}>
                        <Link to={`/tag/${kebabCase(tag)}/`}>{tag}</Link>&ensp;
                      </span>
                    )
                  })
                : null
            }

            const On = () => {
              return post.tags && author.id && "on "
            }

            const Author = () => {
              return (
                author.id && (
                  <span>
                    <Link to={`/author/${kebabCase(author.id)}/`}>
                      {author.id}
                    </Link>
                    &ensp;
                    <On />
                  </span>
                )
              )
            }

            return (
              <article
                className={classNames("post", { featured: post.star })}
                key={`${post.title}-${post.date}`}
              >
                <div className="inner">
                  <header className="post-header">
                    <h2 className="post-title">
                      <Link to={slug}>{post.title}</Link>
                    </h2>
                    <div className="post-meta">
                      {author.avatar && (
                        <div className="post-meta-avatar">
                          <Avatar
                            className="post-other-avatar avatar"
                            name={author.id}
                            avatar={author.avatar}
                          />
                        </div>
                      )}
                      <div className="post-meta-inner">
                        <Author />
                        <Tags />
                        |&ensp;
                        <time>{post.date}</time>
                      </div>
                    </div>
                    <div className="clear" />
                  </header>

                  <section className="post-excerpt">
                    <p>{excerpt}&hellip;</p>
                  </section>
                </div>
              </article>
            )
          })}
      </section>
    )
  }
}

ExcerptLoop.propTypes = {
  edges: PropTypes.array.isRequired,
}
