import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import kebabCase from 'lodash.kebabcase';
import Bio from '../components/Bio';
import Avatar from '../components/Avatar';
import Share from '../components/Share';
import PostContent from '../components/PostContent';
import Header from '../components/Header';

const GithubPrefix = 'https://github.com/xiangsongtao/blog/blob/master/blog/';

export default class BlogPost extends React.Component {
    render() {
        const { currentPost, prevPost, nextPost, site, master } = this.props.data;
        const { next, prev } = this.props.pathContext; // 上一篇和下一篇文章的slug
        const post = currentPost.frontmatter;
        const { siteMetadata } = site;
        const { logo, cover: siteCover, navigation, siteUrl } = siteMetadata;
        const author = post.author || master;
        const cover = post.cover ? post.cover : (siteCover ? siteCover : false);
        const relativePath = currentPost.fields.relativePath;
        const postInGithub = `${GithubPrefix}${relativePath}`;
        const shareUrl = `${siteUrl}${currentPost.fields.slug}`

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
                            <Link
                                to={`/author/${kebabCase(author.id)}/`}>{author.id}</Link> | <time>{post.date} | {currentPost.timeToRead} min
                            read</time> | <a target="_target"
                                             href={postInGithub}><i
                            className="icon icon-github"></i> Edit this page</a>
                        </div>
                    </div>
                </Header>
                <main className="content" role="main">
                    <article className="post">
                        <div className="inner">
                            <PostContent html={currentPost.html} />

                            <section className="post-info">
                                <Share title={post.title} url={shareUrl} />
                                <aside className="post-tags">
                                    {
                                        post.tags && post.tags.map(tag => (
                                            <Link key={tag} to={`/tag/${kebabCase(tag)}/`}>{tag}</Link>))
                                    }
                                </aside>
                                <div className="clear"></div>
                                <aside className="post-author">
                                    <Avatar className="post-author-avatar avatar" avatar={author.avatar}
                                            name={author.id} />
                                    <div className="post-author-bio">
                                        <h4 className="post-author-name">
                                            <Link to={`/author/${kebabCase(author.id)}/`}>{author.id}</Link>
                                        </h4>
                                        <Bio
                                            bio={author.bio}
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
    fields {
      slug
      relativePath
    }
    excerpt(pruneLength: 110)
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
