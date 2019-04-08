import React from "react"
import _ from "lodash"
import PropTypes from "prop-types"
import groupby from "lodash.groupby"
import { Link } from "gatsby"
import kebabCase from "lodash.kebabcase"
import Header from "../components/Header"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import SEO from "../components/SEO"
export default class TagsPageRoute extends React.PureComponent {
  render() {
    const allRowArchive = _.get(this.props, "data.allMarkdownRemark.edges", {})
    const { site } = this.props.data
    const { title, cover, archiveCover, logo, navigation } = site.siteMetadata
    const coverImage = archiveCover || (cover || false)
    const allArchive = allRowArchive.map(item => {
      return {
        ...item.node.frontmatter,
        ...item.node.fields,
      }
    })

    const allArchiveWithYear = groupby(allArchive, "year")

    const List = []

    for (const year in allArchiveWithYear) {
      if (allArchiveWithYear[year] && allArchiveWithYear[year].length > 0) {
        const arts = allArchiveWithYear[year]
        List.unshift(
          <section className="content-archive" key={year}>
            <h2 className="year">{year}</h2>
            <ul>
              {arts.map(item => {
                return (
                  <li key={item.slug} className="link">
                    <span className="meta">{item.date}</span>&emsp;
                    <Link to={`${item.slug}`} className="title">
                      {item.title}
                    </Link>
                    <span className="meta">&ensp;|&ensp;</span>
                    <Link
                      className="meta author"
                      to={`/author/${kebabCase(item.author)}/`}
                    >
                      {item.author}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      }
    }

    return (
      <Layout location={this.props.location}>
        <SEO title={`${title}-Archive`} />
        <Header
          logo={logo}
          cover={coverImage}
          hideNavBack={false}
          navigation={navigation}
          isPost={false}
        >
          <h1 className="blog-name">All Archive</h1>
          <span className="blog-description">Posts: {allArchive.length}</span>
        </Header>
        <div className="container">
          <main className="content" role="main">
            {List}
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
  query ArchiveQuery {
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
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            year: date(formatString: "YYYY")
            date(formatString: "DD MMM")
            author
          }
        }
      }
    }
  }
`
