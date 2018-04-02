import React from 'react';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import PropTypes from 'prop-types';
import kebabCase from 'lodash.kebabcase';
import Header from '../components/Header';

export default class TagsPageRoute extends React.PureComponent {
  render() {
    const allTags = this.props.data.allMarkdownRemark.group;
    const { site } = this.props.data;
    const { title, cover, tagCover, logo, navigation } = site.siteMetadata;
    const coverImage = tagCover || (cover || false);
    return (
      <div>
        <Helmet title={`${title}-Tags`} />
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
      </div>
    );
  }
}

TagsPageRoute.propTypes = {
  data: PropTypes.object.isRequired,
};

/* eslint-disable */
export const pageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
