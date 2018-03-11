import React from 'react';
import Helmet from 'react-helmet';
import ExcerptLoop from '../components/ExcerptLoop';
import Header from '../components/Header';

export default class TagRoute extends React.Component {
    render() {
        const { allMarkdownRemark, site } = this.props.data;
        const { edges } = allMarkdownRemark;
        const { title, cover, tagCover, navigation, logo } = site.siteMetadata;
        const { totalCount } = this.props.data.allMarkdownRemark;
        const { tag } = this.props.pathContext;
        const coverImage = tagCover ? tagCover : (cover ? cover : false);
        return (
            <div>
                <Helmet title={title} />
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
                    <main className="content" role="main">
                        <ExcerptLoop edges={edges} />
                    </main>
                </div>
            </div>
        );
    }
}

export const pageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
        logo
        siteUrl
        cover
        tagCover
        navigation
      }
    }
    master: authorJson(master: {eq: true}) {
      ...authorFrag
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
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
