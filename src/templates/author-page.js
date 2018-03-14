import React from 'react';
import classNames from 'classnames';
import kebabCase from 'lodash.kebabcase';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import ExcerptLoop from '../components/ExcerptLoop';
import Avatar from '../components/Avatar';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import Bio from '../components/Bio';
import { withPrefix } from "gatsby-link";

export default class AuthorRoute extends React.Component {

    getOtherAuthorsInfo() {
        const { otherAuthorsInfo, allAuthor } = this.props.data;
        const tmpAuthorList = allAuthor.group.map(item => item.fieldValue);
        const tmpAuthorInfoList = otherAuthorsInfo.edges.map(item => {
            return { name: item.node.id, avatar: item.node.avatar };
        });
        return tmpAuthorList.reduce((all, item) => {
            let res = tmpAuthorInfoList.filter(a => a.name === item)[0];
            res && all.push(res);
            return all;
        }, []);
    }

    render() {
        const { allMarkdownRemark, site, authorJson: author } = this.props.data;
        const { totalCount = 0, edges } = allMarkdownRemark || {};
        const { cover, navigation, logo, title } = site.siteMetadata;
        const coverImage = author.cover ? author.cover : (cover ? cover : false);
        const { skip = 0, limit = 10 } = this.props.pathContext;
        const kebabCaseName = kebabCase(author.id);
        const othersAuthers = this.getOtherAuthorsInfo();

        const OtherAuthors = () => {
            return (
                <div className="post-author-others">
                    {
                        othersAuthers.reverse().map(item => (
                            <Link
                                to={`/author/${kebabCase(item.name)}/`}
                                className="other-avatar"
                                key={item.name}>
                                <Avatar className="post-other-avatar avatar" name={item.name} avatar={item.avatar} />
                            </Link>
                        ))
                    }
                </div>
            );
        };

        return (
            <div>
                <Helmet title={`${title}-${author.id}`} />
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
                            <Avatar className="post-author-avatar avatar" avatar={author.avatar} name={author.id} />
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
                            <OtherAuthors />
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
    otherAuthorsInfo: allAuthorJson(filter: {id: {ne: $author}}) {
        edges {
          node {
            id
            avatar
            master
          }
        }
    }
    allAuthor: allMarkdownRemark(filter: {frontmatter: {draft: {ne: true}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
        totalCount
        group(field: frontmatter___author) {
          fieldValue
          totalCount
        }
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
