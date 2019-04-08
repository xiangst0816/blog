import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import kebabCase from "lodash.kebabcase"
import { Link } from "gatsby"
import { navigate } from "gatsby"
import { graphql } from "gatsby"
import ExcerptLoop from "../components/ExcerptLoop"
import Avatar from "../components/Avatar"
import Header from "../components/Header"
import Pagination from "../components/Pagination"
import Bio from "../components/Bio"
import Layout from "../components/Layout"
import SEO from "../components/SEO"

export default class AuthorRoute extends React.PureComponent {
  getOtherAuthorsInfo() {
    const { otherAuthorsInfo, allAuthorJson } = this.props.data
    if (!otherAuthorsInfo) {
      return []
    }

    const tmpAuthorList = allAuthorJson.edges.map(item => item.node.id)
    const tmpAuthorInfoList = otherAuthorsInfo.edges.map(item => {
      return { name: item.node.id, avatar: item.node.avatar }
    })
    return tmpAuthorList.reduce((all, item) => {
      const res = tmpAuthorInfoList.filter(a => a.name === item)[0]
      res && all.push(res)
      return all
    }, [])
  }

  render() {
    const {
      currentMarkdownRemark,
      allMarkdownRemark,
      site,
      authorJson: author,
    } = this.props.data || {}
    const { authorJson } = this.props.data
    if (!authorJson) {
      navigate("/404")
      return null
    }
    const { edges } = currentMarkdownRemark || {}
    const { totalCount = 0 } = allMarkdownRemark || {}
    const { cover, navigation, logo, title } = site.siteMetadata
    const coverImage = author.cover ? author.cover : cover || false
    const { skip = 0, limit = 10 } = this.props.pageContext
    const kebabCaseName = kebabCase(author.id)
    const othersAuthers = this.getOtherAuthorsInfo()

    const authorList = this.props.data.allAuthorJson.edges.map(item => {
      return {
        id: item.node.id,
        avatar: item.node.avatar,
      }
    })

    const OtherAuthors = () => {
      return (
        <div className="post-author-others">
          {othersAuthers.reverse().map(item => (
            <Link
              to={`/author/${kebabCase(item.name)}/`}
              className="other-avatar"
              key={item.name}
            >
              <Avatar
                className="post-other-avatar avatar"
                name={item.name}
                avatar={item.avatar}
              />
            </Link>
          ))}
        </div>
      )
    }

    return (
      <Layout className="tag-template" location={this.props.location}>
        <SEO title={`${title}-${author.id}`} />
        <Header
          cover={coverImage}
          logo={logo}
          hideNavBack={false}
          navigation={navigation}
          isPost={false}
        />
        <section
          id="blog-author"
          className={classNames({ "has-cover": coverImage })}
        >
          <div className="inner">
            <aside className="post-author">
              <Avatar
                className="post-author-avatar avatar"
                avatar={author.avatar}
                name={author.id}
              />
              <div className="post-author-bio">
                <h2 className="post-author-name">{author.id}</h2>
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
              <OtherAuthors />
              <div className="clear" />
            </aside>
          </div>
        </section>
        <div id="index" className="container">
          <main
            className={classNames("content", { paged: skip > 0 })}
            role="main"
          >
            <div className="extra-pagination">
              <Pagination
                skip={skip}
                limit={limit}
                total={totalCount}
                pathPrefix={`/author/${kebabCaseName}/`}
              />
            </div>
            <ExcerptLoop edges={edges} authorList={authorList} />
            <Pagination
              skip={skip}
              limit={limit}
              total={totalCount}
              pathPrefix={`/author/${kebabCaseName}/`}
            />
          </main>
        </div>
      </Layout>
    )
  }
}

AuthorRoute.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

/* eslint-disable */
export const pageQuery = graphql`
  query AuthorBlogs($author: String!, $skip: Int = 0, $limit: Int = 10) {
    authorJson(id: { eq: $author }) {
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
    allAuthorJson {
      totalCount
      edges {
        node {
          id
          avatar
        }
      }
    }
    site {
      siteMetadata {
        title
        cover
        author
        description
        keywords
        tagCover
        archiveCover
        siteUrl
        logo
        navigation
        subscribe
      }
    }
    otherAuthorsInfo: allAuthorJson(filter: { id: { ne: $author } }) {
      edges {
        node {
          id
          avatar
          master
        }
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { draft: { ne: true }, author: { eq: $author } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      totalCount
    }
    currentMarkdownRemark: allMarkdownRemark(
      skip: $skip
      limit: $limit
      filter: { frontmatter: { draft: { ne: true }, author: { eq: $author } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 250)
          fields {
            slug
          }
          frontmatter {
            title
            tags
            star
            date(formatString: "DD MMM YYYY")
            author
          }
        }
      }
    }
  }
`
