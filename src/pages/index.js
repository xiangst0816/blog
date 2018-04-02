import React from 'react';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import ExcerptLoop from '../components/ExcerptLoop';
import Pagination from '../components/Pagination';
import Header from '../components/Header';

export default class Index extends React.PureComponent {
    render() {
        const { edges, totalCount } = this.props.data.allMarkdownRemark;
        const { skip = 0, limit = 10 } = this.props.pathContext;
        const {
            cover,
            navigation,
            description,
            title,
            logo,
        } = this.props.data.site.siteMetadata;

        return (
            <div className={classNames('home-template', { paged: skip > 0 })}>
                <Helmet title={title} />
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
                        className={classNames('content', { paged: skip > 0 })}
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
                        <ExcerptLoop edges={edges} />
                        <Pagination
                            skip={skip}
                            limit={limit}
                            total={totalCount}
                            pathPrefix="/page/"
                        />
                    </main>
                </div>
            </div>
        );
    }
}

Index.propTypes = {
    data: PropTypes.object.isRequired,
    pathContext: PropTypes.object.isRequired,
};

/* eslint-disable */
export const pageQuery = graphql`
  query IndexQuery($skip: Int = 0, $limit: Int = 10) {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    allMarkdownRemark(
      skip: $skip
      limit: $limit
      filter: { frontmatter: { draft: { ne: true } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      totalCount
      edges {
        ...markdownRemarkEdgeFrag
      }
    }
  }
`;
