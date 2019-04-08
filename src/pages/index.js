import React from "react"
import _ from "lodash"
import classNames from "classnames"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import ExcerptLoop from "../components/ExcerptLoop"
import Pagination from "../components/Pagination"
import Header from "../components/Header"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import SEO from "../components/SEO"
export default class Index extends React.PureComponent {
  render() {
    const { edges } = _.get(this.props, "data.currentMarkdownRemark", {})
    const { totalCount } = _.get(this.props, "data.allMarkdownRemark", {})

    const { skip = 0, limit = 10 } = this.props.pageContext || {}
    const { cover, navigation, description, title, logo } = _.get(
      this.props,
      "data.site.siteMetadata",
      {}
    )

    const authorList = this.props.data.allAuthorJson.edges.map(item => {
      return {
        id: item.node.id,
        avatar: item.node.avatar,
      }
    })

    return (
      <Layout location={this.props.location}>
        <div className={classNames("home-template", { paged: skip > 0 })}>
          <SEO title={title} />
          <Header
            logo={logo}
            cover={cover}
            hideNavBack
            navigation={navigation}
            isPost={false}
          >
            <h1 className="blog-name">
              <Link to="/">{title}</Link>
            </h1>
            {description && (
              <span className="blog-description">{description}</span>
            )}
          </Header>
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
                  pathPrefix="/page/"
                />
              </div>
              <ExcerptLoop edges={edges} authorList={authorList} />
              <Pagination
                skip={skip}
                limit={limit}
                total={totalCount}
                pathPrefix="/page/"
              />
            </main>
          </div>
        </div>
      </Layout>
    )
  }
}

Index.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

/* eslint-disable */
export const pageQuery = graphql`
  query IndexQuery($skip: Int = 0, $limit: Int = 10) {
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
      filter: { frontmatter: { draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      totalCount
    }
    currentMarkdownRemark: allMarkdownRemark(
      skip: $skip
      limit: $limit
      filter: { frontmatter: { draft: { ne: true } } }
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
