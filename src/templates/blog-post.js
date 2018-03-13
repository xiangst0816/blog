import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import kebabCase from 'lodash.kebabcase';
import Bio from '../components/Bio';
import Avatar from '../components/Avatar';
import Share from '../components/Share';
import PostContent from '../components/PostContent';
import Header from '../components/Header';

export default class BlogPost extends React.Component {
    render() {
        const { currentPost, prevPost, nextPost, site, master } = this.props.data;
        const { next, prev } = this.props.pathContext; // 上一篇和下一篇文章的slug
        const post = currentPost.frontmatter;
        const { siteMetadata } = site;
        const { logo, cover: siteCover, navigation } = siteMetadata;
        const author = post.author || master;
        const cover = post.cover ? post.cover : (siteCover ? siteCover : false);
        return (
            <div>
                <Helmet title={post.title} />
                <Header
                    logo={logo}
                    cover={cover}
                    hideNavBack={false}
                    navigation={navigation}
                    isPost={true}
                >
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <div className="post-meta-inner">
                            <a href={`/author/${kebabCase(author.id)}/`}>{author.id}</a> | <time>{post.date} | {currentPost.timeToRead} min
                            read</time>
                        </div>
                    </div>
                </Header>
                <main className="content" role="main">
                    <article className="post">
                        <div className="inner">
                            <PostContent html={currentPost.html} />

                            <section className="post-info">
                                <Share title={post.title} />
                                <aside className="post-tags">
                                    {
                                        post.tags && post.tags.map(tag => (
                                            <a key={tag} href={`/tag/${kebabCase(tag)}/`}>{tag}</a>))
                                    }
                                </aside>
                                <div className="clear"></div>
                                <aside className="post-author">
                                    <Avatar avatar={author.avatar} name={author.id} />
                                    <div className="post-author-bio">
                                        <h4 className="post-author-name"><a
                                            href={`/author/${kebabCase(author.id)}/`}>{author.id}</a></h4>
                                        <Bio
                                            bio={author.bio}
                                            count={totalCount}
                                            location={author.location}
                                            website={author.website}
                                            twitter={author.twitter}
                                            facebook={author.facebook}
                                            github={author.github}
                                            weibo={author.weibo}
                                        />
                                    </div>
                                    <div className="clear"></div>
                                </aside>
                            </section>

                            {/* TODO */}
                            {/*<section className="post-comments">*/}
                            {/*<a id="show-disqus" className="post-comments-activate">Show Comments</a>*/}
                            {/*<div id="disqus_thread"></div>*/}
                            {/*</section>*/}

                            {/*{*/}
                            {/*siteMetadata.subscribe && (*/}
                            {/*<section className="post-subscribe">*/}
                            {/*<form className="post-subscribe-form">*/}
                            {/*<input className="post-subscribe-input" placeholder="Your email address" />*/}
                            {/*<button className="post-subscribe-button">Submit</button>*/}
                            {/*</form>*/}
                            {/*<p>Get the latest posts delivered right to your inbox.</p>*/}
                            {/*</section>*/}
                            {/*)*/}
                            {/*}*/}

                            <aside className="post-nav">
                                {
                                    prev && (
                                        <Link className="post-nav-prev" to={prev}>
                                            <section className="post-nav-teaser">
                                                <i className="icon icon-arrow-left"></i>
                                                <h2 className="post-nav-title">{prevPost.frontmatter.title}</h2>
                                                <p className="post-nav-excerpt">{prevPost.excerpt}&hellip;</p>
                                            </section>
                                        </Link>
                                    )
                                }
                                {
                                    next && (
                                        <Link className="post-nav-next" to={next}>
                                            <section className="post-nav-teaser">
                                                <i className="icon icon-arrow-right"></i>
                                                <h2 className="post-nav-title">{nextPost.frontmatter.title}</h2>
                                                <p className="post-nav-excerpt">{nextPost.excerpt}&hellip;</p>
                                            </section>
                                        </Link>
                                    )
                                }
                                <div className="clear"></div>
                            </aside>
                        </div>
                    </article>
                </main>
            </div>
        );
    }
}

export const pageQuery = graphql`
  fragment postFrag on MarkdownRemark {
    html
    timeToRead
    wordCount {
      paragraphs
      sentences
      words
    }
    excerpt(pruneLength: 120)
    frontmatter {
      title
      date(formatString: "DD MMM YYYY")
      tags
      cover
      author {
        ...authorFrag
      }
    }
  }

  query BlogPostBySlug($curr: String!, $prev: String!, $next: String!) {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    master: authorJson(master: {eq: true}) {
      ...authorFrag
    }
    currentPost: markdownRemark(fields: {slug: {eq: $curr }}) {
      ...postFrag
    }
    nextPost: markdownRemark(fields: {slug: {eq: $next }}) {
      ...postFrag
    }
    prevPost: markdownRemark(fields: {slug: {eq: $prev }}) {
      ...postFrag
    }
  }
`;
