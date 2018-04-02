import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import kebabCase from 'lodash.kebabcase';
import classNames from 'classnames';
import ExcerptLoop from '../components/ExcerptLoop';
import Header from '../components/Header';
import Pagination from '../components/Pagination';

export default class TagRoute extends React.PureComponent {
  render() {
    const { allMarkdownRemark, site } = this.props.data;
    const { edges } = allMarkdownRemark;
    const { title, cover, tagCover, navigation, logo } = site.siteMetadata;
    const { totalCount } = this.props.data.allMarkdownRemark;
    const { tag } = this.props.pathContext;
    const coverImage = tagCover || (cover || false);

    const { skip = 0, limit = 10 } = this.props.pathContext;
    const kebabCaseName = kebabCase(tag);

    return (
      <div className="tag-template">
        <Helmet title={`${title}-Tag`} />
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
            className={classNames('content', { paged: skip > 0 })}
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
            <ExcerptLoop edges={edges} />
            <Pagination
              skip={skip}
              limit={limit}
              total={totalCount}
              pathPrefix={`/tag/${kebabCaseName}/`}
            />
          </main>
        </div>
      </div>
    );
  }
}

TagRoute.propTypes = {
  data: PropTypes.object.isRequired,
  pathContext: PropTypes.object.isRequired,
};

/* eslint-disable */
export const pageQuery = graphql`
  query TagPage($tag: String, $skip: Int = 0, $limit: Int = 10) {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    master: authorJson(master: { eq: true }) {
      ...authorFrag
    }
    allMarkdownRemark(
      skip: $skip
      limit: $limit
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        ...markdownRemarkEdgeFrag
      }
    }
  }
`;
