import React from 'react';
import classNames from 'classnames';
import kebabCase from 'lodash.kebabcase';
import Helmet from 'react-helmet';
import ExcerptLoop from '../components/ExcerptLoop';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import Bio from '../components/Bio';

export default class AuthorRoute extends React.Component {
    render() {
        const { allMarkdownRemark, site, authorJson: author } = this.props.data;
        const { totalCount = 0, edges } = allMarkdownRemark || {};
        const { cover, navigation, logo, title } = site.siteMetadata;
        const coverImage = author.cover ? author.cover : (cover ? cover : false);

        const { skip = 0, limit = 10 } = this.props.pathContext;
        const kebabCaseName = kebabCase(author.id);

        return (
            <div>
                <Helmet title={title} />
                <Header
                    cover={coverImage}
                    logo={logo}
                    hideNavBack={false}
                    navigation={navigation}
                    isPost={false}
                />
                <section id="blog-author" className={classNames({ 'has-cover': coverImage })}>
                    <div className="inner">
                        <aside className="post-author">
                            <Avatar avatar={author.avatar} name={author.id} />
                            <div className="post-author-bio">
                                <h2 className="post-author-name">{author.id}</h2>
                                <Bio
                                    bio={author.bio}
                                    count={totalCount}
                                    location={author.location}
                                    website={author.website}
                                    twitter={author.twitter}
                                    facebook={author.facebook}
                                    github={author.github}
                                    weibo={author.weibo}
                                />
                            </div>
                            <div className="clear"></div>
                        </aside>
                    </div>
                </section>
                <div id="index" className="container">
                    <main className={classNames('content', { 'paged': skip > 0 })} role="main">
                        <div className="extra-pagination">
                            <Pagination
                                skip={skip}
                                limit={limit}
                                total={totalCount}
                                pathPrefix={`/author/${kebabCaseName}/`}
                            />
                        </div>
                        <ExcerptLoop edges={edges} />
                        <Pagination
                            skip={skip}
                            limit={limit}
                            total={totalCount}
                            pathPrefix={`/author/${kebabCaseName}/`}
                        />
                    </main>
                </div>
            </div>
        );
    }
}

export const pageQuery = graphql`
  query AuthorBlogs($author: String!, $skip: Int = 0, $limit: Int = 10) {
    authorJson(id: {eq:$author}){
      ...authorFrag
    }
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    master: authorJson(master: {eq: true}) {
      ...authorFrag
    }
    allMarkdownRemark(
      skip: $skip, limit: $limit,
      filter: {frontmatter: {draft: {ne: true}, author: {eq: $author}}}, sort: {order: DESC, fields: [frontmatter___date]}
    ) {
      totalCount
      edges {
        ...markdownRemarkEdgeFrag
      }
    }
  }

`;
