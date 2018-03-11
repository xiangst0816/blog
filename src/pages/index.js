import React from 'react';
import classNames from 'classnames';
import Helmet from 'react-helmet';
import ExcerptLoop from '../components/ExcerptLoop';
import Pagination from '../components/Pagination';
import Header from '../components/Header';

export default class Index extends React.Component {
    render() {
        const { edges, totalCount } = this.props.data.allMarkdownRemark;
        const { skip = 0, limit = 10 } = this.props.pathContext;
        const { cover, navigation, description, title, logo } = this.props.data.site.siteMetadata;

        return (
            <div className="home-template">
                <Helmet title={title} />
                <Header
                    logo={logo}
                    cover={cover}
                    hideNavBack={true}
                    navigation={navigation}
                    isPost={false}
                >
                    <h1 className="blog-name"><a href="/">{title}</a></h1>
                    {
                        description && (
                            <span className="blog-description">{description}</span>)
                    }
                </Header>
                <div id="index" className="container">
                    <main className={classNames('content', { 'paged': skip > 0 })} role="main">
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

export const pageQuery = graphql`
  query IndexQuery($skip: Int = 0, $limit: Int = 10) {
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    allMarkdownRemark(skip: $skip, limit: $limit, filter: {frontmatter: {draft: {ne: true}}}, sort: { order: DESC, fields: [frontmatter___date] }) {
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
            date(formatString: "DD MMM YYYY")
            author {
              ...authorFrag
            }
          }
        }
      }
    }
  }
`;
