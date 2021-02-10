import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash.kebabcase"
import classNames from "classnames"
import ExcerptLoop from "../components/ExcerptLoop"
import Header from "../components/Header"
import Pagination from "../components/Pagination"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import SEO from "../components/SEO"
export default class TagRoute extends React.PureComponent {
  render() {
    const { currentMarkdownRemark, allMarkdownRemark, site } =
      this.props.data || {}
    const { edges } = currentMarkdownRemark
    const { title, cover, tagCover, navigation, logo } = site.siteMetadata
    const { totalCount } = allMarkdownRemark || {}
    const { tag } = this.props.pageContext
    const coverImage = tagCover || cover || false

    const { skip = 0, limit = 10 } = this.props.pageContext
    const kebabCaseName = kebabCase(tag)

    const authorList = this.props.data.allAuthorJson.edges.map(item => {
      return {
        id: item.node.id,
        avatar: item.node.avatar,
      }
    })
    return (
      <Layout className="tag-template" location={this.props.location}>
        <SEO title={`${title}-Tag`} />
        <Header
          cover={coverImage}
          logo={logo}
          hideNavBack={false}
          navigation={navigation}
          isPost={false}
        >
          <h1 className="blog-name">{tag}</h1>
          <span className="blog-description">Posts: {totalCount}</span>
        </Header>
        <div className="container">
          <main
            className={classNames("content", { paged: skip > 0 })}
            role="main"
          >
            <div className="extra-pagination">
              <Pagination
                skip={skip}
                limit={limit}
                total={totalCount}
                pathPrefix={`/tag/${kebabCaseName}/`}
              />
            </div>
            <ExcerptLoop edges={edges} authorList={authorList} />
            <Pagination
              skip={skip}
              limit={limit}
              total={totalCount}
              pathPrefix={`/tag/${kebabCaseName}/`}
            />
          </main>
        </div>
      </Layout>
    )
  }
}

TagRoute.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

/* eslint-disable */
export const pageQuery = graphql`
  query TagPage($tag: String, $skip: Int = 0, $limit: Int = 10) {
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
    master: authorJson(master: { eq: true }) {
      id
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
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      totalCount
    }
    currentMarkdownRemark: allMarkdownRemark(
      skip: $skip
      limit: $limit
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
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
