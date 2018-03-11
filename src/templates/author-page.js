import React from 'react';
import classNames from 'classnames';
import ExcerptLoop from '../components/ExcerptLoop';
import Website from '../components/Bio/Website';
import Twitter from '../components/Bio/Twitter';
import Facebook from '../components/Bio/Facebook';
import Github from '../components/Bio/Github';
import Zhihu from '../components/Bio/Zhihu';
import Weibo from '../components/Bio/Weibo';
import Location from '../components/Bio/Location';
import Bio from '../components/Bio/Bio';
import Stats from '../components/Bio/Stats';
import Avatar from '../components/Avatar';
import Header from '../components/Header';

export default class AuthorRoute extends React.Component {
    render() {
        const { allMarkdownRemark, site, authorJson: author } = this.props.data;
        const { totalCount = 0, edges } = allMarkdownRemark || {};
        const { cover, navigation, logo } = site.siteMetadata;
        const coverImage = author.cover ? author.cover : (cover ? cover : false);
        return (
            <div>
                <Header
                    cover={cover}
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
                                <Bio bio={author.bio} />
                                <Stats count={totalCount} />
                                <Location location={author.location} />
                                <Website website={author.website} />
                                <Twitter twitter={author.twitter} />
                                <Facebook facebook={author.facebook} />
                                <Github github={author.github} />
                                <Zhihu zhihu={author.zhihu} />
                                <Weibo weibo={author.weibo} />
                            </div>
                            <div className="clear"></div>
                        </aside>
                    </div>
                </section>
                <div id="index" className="container">
                    <main className="content" role="main">
                        <ExcerptLoop edges={edges} />
                    </main>
                </div>
            </div>
        );
    }
}

export const pageQuery = graphql`
  query AuthorBlogs($author: String!) {
    authorJson(id: {eq:$author}){
      ...authorFrag
    }
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    allMarkdownRemark(limit: 1000, filter: {frontmatter: {draft: {ne: true}, author: {eq: $author}}}, sort: {order: DESC, fields: [frontmatter___date]}) {
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
