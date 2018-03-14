import React from 'react';
import Link from 'gatsby-link';
import kebabCase from 'lodash.kebabcase';
import classNames from 'classnames';

export default class ExcerptLoop extends React.Component {
    render() {
        const { edges } = this.props;
        return (
            <section>
                {
                    edges && edges.map(edge => {
                        const { slug } = edge.node.fields;
                        const post = edge.node.frontmatter;
                        const excerpt = edge.node.excerpt;
                        const author = post.author;

                        const Tags = () => {
                            return post.tags ? post.tags.map(tag => {
                                return (<span key={tag}><Link to={`/tag/${kebabCase(tag)}/`}>{tag}</Link></span>);
                            }) : null;
                        };

                        const On = () => {
                            return post.tags && author.id && (' on ');
                        };

                        const Author = () => {
                            return author.id &&
                                (
                                    <span>
                                        <Link to={`/author/${kebabCase(author.id)}/`}>{author.id}</Link>
                                        <On />
                                    </span>
                                );
                        };

                        return (
                            <article className={classNames('post', { 'featured': post.star })} key={post.title}>
                                <div className="inner">
                                    <header className="post-header">
                                        <h2 className="post-title">
                                            <Link to={slug}>{post.title}</Link>
                                        </h2>
                                        <div className="post-meta">
                                            {
                                                author.avatar && (
                                                    <div className="post-meta-avatar">
                                                        <img className="avatar"
                                                             src={author.avatar}
                                                             alt={author.id} />
                                                    </div>
                                                )
                                            }
                                            <div className="post-meta-inner">
                                                <Author />
                                                <Tags />
                                                &ensp;|&ensp;
                                                <time>{post.date}</time>
                                            </div>
                                        </div>
                                        <div className="clear"></div>
                                    </header>

                                    <section className="post-excerpt">
                                        <p>{excerpt}&hellip;</p>
                                    </section>
                                </div>
                            </article>
                        );
                    })
                }
            </section>
        );
    }
}
