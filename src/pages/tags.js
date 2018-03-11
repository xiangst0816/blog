import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import kebabCase from 'lodash/kebabCase';
import Pagination from '../components/Pagination';
import Header from '../components/Header';

export default class TagsPageRoute extends React.Component {
    render() {
        const allTags = this.props.data.allMarkdownRemark.group;
        const { allMarkdownRemark, site } = this.props.data;
        const { edges } = allMarkdownRemark;
        const { title, cover, tagCover, logo, navigation, description } = site.siteMetadata;
        const { totalCount } = this.props.data.allMarkdownRemark;
        const { tag } = this.props.pathContext;
        const coverImage = tagCover ? tagCover : (cover ? cover : false);
        return (
            <div>
                <Helmet title={title} />
                <Header
                    logo={logo}
                    cover={coverImage}
                    hideNavBack={false}
                    navigation={navigation}
                    isPost={false}
                >
                    <h1 className="blog-name">All Tags</h1>
                    <span className="blog-description">Posts: {allTags.length}</span>
                </Header>
                <div className="container ">
                    <main className="content content-tags" role="main">
                        {allTags.map(tag =>
                            <article className="tags" key={tag.fieldValue}>
                                <div className="inner">
                                    <Link
                                        style={{
                                            textDecoration: 'none',
                                        }}
                                        to={`/tag/${kebabCase(tag.fieldValue)}/`}
                                    >
                                        {tag.fieldValue} ({tag.totalCount})
                                    </Link>
                                </div>
                            </article>
                        )}
                        <Pagination page="1" pages="1" />
                    </main>
                </div>
            </div>
        );
    }
}

export const pageQuery = graphql`
  query TagsQuery($skip: Int = 0, $limit: Int = 3) {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      group(skip: $skip, limit: $limit, field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
