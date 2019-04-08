import React from "react"
import _ from "lodash"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import kebabCase from "lodash.kebabcase"
import Header from "../components/Header"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import SEO from "../components/SEO"
export default class TagsPageRoute extends React.PureComponent {
  render() {
    const allTags = _.get(this.props, "data.allMarkdownRemark.group", [])
    const { site } = this.props.data
    const { title, cover, tagCover, logo, navigation } = site.siteMetadata
    const coverImage = tagCover || (cover || false)
    return (
      <Layout location={this.props.location}>
        <SEO title={`${title}-Tags`} />
        <Header
          logo={logo}
          cover={coverImage}
          hideNavBack={false}
          navigation={navigation}
          isPost={false}
        >
          <h1 className="blog-name">All Tags</h1>
          <span className="blog-description">Tags: {allTags.length}</span>
        </Header>
        <div className="container">
          <main className="content" role="main">
            <div className="content-tags">
              {allTags.map(tag => (
                <span className="tags" key={tag.fieldValue}>
                  <Link to={`/tag/${kebabCase(tag.fieldValue)}/`}>
                    {tag.fieldValue}({tag.totalCount})
                  </Link>
                </span>
              ))}
            </div>
          </main>
        </div>
      </Layout>
    )
  }
}

TagsPageRoute.propTypes = {
  data: PropTypes.object.isRequired,
}

/* eslint-disable */
export const pageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
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
    }
    allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
