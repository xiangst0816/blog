import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { graphql } from "gatsby"

import kebabCase from "lodash.kebabcase"
import Bio from "../components/Bio"
import SEO from "../components/SEO"
import Avatar from "../components/Avatar"
import Share from "../components/Share"
import PostContent from "../components/PostContent"
import Header from "../components/Header"
import Disqus from "../components/Disqus"
import Layout from "../components/Layout"

const GithubPrefix = "https://github.com/xiangst0816/blog/edit/master/blog/"

export default class BlogPost extends React.PureComponent {
  render() {
    const { currentPost, prevPost, nextPost, site, master } = this.props.data
    const { next, prev } = this.props.pageContext // 上一篇和下一篇文章的slug
    const post = currentPost.frontmatter
    const { siteMetadata } = site
    const { logo, cover: siteCover, navigation, siteUrl } = siteMetadata
    const authorId = post.author || master
    const cover = post.cover ? post.cover : siteCover || false
    const { relativePath, slug } = currentPost.fields
    const postInGithub = `${GithubPrefix}${relativePath}`
    const shareUrl = `${siteUrl}${slug}`

    const authorList = this.props.data.allAuthorJson.edges.map(item => {
      return {
        ...item.node,
      }
    })

    const author = authorList.find(item => item.id === authorId)

    return (
      <Layout location={this.props.location}>
        <SEO
          title={post.title}
          description={currentPost.excerpt}
          keywords={[post.title, author.id, ...post.tags]}
        />
        <Header
          logo={logo}
          cover={cover}
          hideNavBack={false}
          navigation={navigation}
          isPost
        >
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <div className="post-meta-inner">
              <Link to={`/author/${kebabCase(author.id)}/`}>{author.id}</Link> |{" "}
              <time>
                {post.date} | {currentPost.timeToRead} min read
              </time>{" "}
              |{" "}
              <a target="_target" href={postInGithub} rel="noopener noreferrer">
                <i className="icon icon-github" /> Edit this page
              </a>
            </div>
          </div>
        </Header>
        <main className="content" role="main">
          <article className="post">
            <div className="inner">
              <PostContent html={currentPost.html} />

              {/*<hr/>*/}
              <ul className="post-copyright">
                <li>
                  <strong>本文作者：</strong>
                  {author.id}
                </li>
                <li>
                  <strong>本文题目：</strong>
                  {post.title}
                </li>
                <li>
                  <strong>本文链接：</strong>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    {shareUrl}
                  </a>
                </li>
                <li>
                  <strong>版权声明：</strong>本博客所有文章除特别声明外，均采用
                  <a
                    href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CC BY-NC-SA 3.0
                  </a>{" "}
                  许可协议。转载请注明出处！
                </li>
              </ul>

              <section className="post-info">
                <Share title={post.title} url={shareUrl} />
                <aside className="post-tags">
                  {post.tags &&
                    post.tags.map(tag => (
                      <Link key={tag} to={`/tag/${kebabCase(tag)}/`}>
                        {tag}
                      </Link>
                    ))}
                </aside>
                <div className="clear" />
                <aside className="post-author">
                  <Avatar
                    className="post-author-avatar avatar"
                    avatar={author.avatar}
                    name={author.id}
                  />
                  <div className="post-author-bio">
                    <h4 className="post-author-name">
                      <Link to={`/author/${kebabCase(author.id)}/`}>
                        {author.id}
                      </Link>
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
                  <div className="clear" />
                </aside>
              </section>
              {post.comments && (
                <Disqus
                  showComments={post.comments}
                  title={post.title}
                  slug={slug}
                />
              )}
              <aside className="post-nav">
                {prev && (
                  <Link className="post-nav-prev" to={prev}>
                    <section className="post-nav-teaser">
                      <i className="icon icon-arrow-left" />
                      <h2 className="post-nav-title">
                        {prevPost.frontmatter.title}
                      </h2>
                      <p className="post-nav-excerpt">
                        {prevPost.excerpt}&hellip;
                      </p>
                    </section>
                  </Link>
                )}
                {next && (
                  <Link className="post-nav-next" to={next}>
                    <section className="post-nav-teaser">
                      <i className="icon icon-arrow-right" />
                      <h2 className="post-nav-title">
                        {nextPost.frontmatter.title}
                      </h2>
                      <p className="post-nav-excerpt">
                        {nextPost.excerpt}&hellip;
                      </p>
                    </section>
                  </Link>
                )}
                <div className="clear" />
              </aside>
            </div>
          </article>
        </main>
      </Layout>
    )
  }
}

BlogPost.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

/* eslint-disable */
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
      comments
      author
    }
  }

  fragment siteFrag on SiteSiteMetadata {
    title
    cover
    description
    keywords
    tagCover
    archiveCover
    siteUrl
    logo
    navigation
    subscribe
  }
  fragment authorFrag on AuthorJson {
    id
    bio
    avatar
    cover
    github
    twitter
    zhihu
    weibo
    facebook
    website
    location
  }
  query BlogPostBySlug($curr: String!, $prev: String!, $next: String!) {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    allAuthorJson {
      totalCount
      edges {
        node {
          ...authorFrag
        }
      }
    }
    master: authorJson(master: { eq: true }) {
      ...authorFrag
    }
    currentPost: markdownRemark(fields: { slug: { eq: $curr } }) {
      ...postFrag
    }
    nextPost: markdownRemark(fields: { slug: { eq: $next } }) {
      ...postFrag
    }
    prevPost: markdownRemark(fields: { slug: { eq: $prev } }) {
      ...postFrag
    }
  }
`
