import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import '../sass/style.scss';
import 'katex/dist/katex.min.css';

const BUILD_TIME = new Date();

if (typeof window !== `undefined`) {
    const AttachFastClick = require("fastclick");
    new AttachFastClick(document.body);
}

export default class Template extends React.Component {
    static propTypes = {
        children: PropTypes.func,
    };

    componentDidMount() {
        // import('fastclick').then((AttachFastClick) => {
        //     console.log(AttachFastClick)
        //     new AttachFastClick(document.body);
        // });
        window && window['console'] && window['console'].log(`BUILD_TIME: ${BUILD_TIME}`);
    }

    toggle = () => {
        document.documentElement.classList.toggle('menu-active');
    };

    render() {
        const master = this.props.data.master;
        const site = this.props.data.site.siteMetadata;

        return (
            <article>
                <Helmet
                    title={site.title}
                    meta={[
                        { name: 'description', content: `${site.title}` },
                        { name: 'keywords', content: `${site.keywords}` },
                    ]}
                />
                <Navigation master={master} site={site} {...this.props} />
                <section id="wrapper">
                    <a className="hidden-close" onClick={this.toggle}></a>
                    {this.props.children()}
                    <div id="body-class" style={{ display: 'none' }} className="tag-template"></div>
                    <Footer />
                </section>
            </article>
        );
    }
}
export const pageQuery = graphql`
  fragment authorFrag on AuthorJson {
    id
    bio
    avatar
    cover
    github
    twitter
    zhihu
    weibo
    facebook
    website
    location
  }
  fragment markdownRemarkEdgeFrag on MarkdownRemarkEdge {
    node {
      excerpt(pruneLength: 250)
      fields {
        slug
      }
      frontmatter {
        title
        tags
        star
        date(formatString: "DD MMM YYYY")
        author {
          ...authorFrag
        }
      }
    }
  }

  fragment siteFrag on siteMetadata_2 {
    title
    cover
    description
    keywords
    tagCover
    siteUrl
    logo
    navigation
    subscribe
  }

  query LayoutQuery{
    site {
      siteMetadata {
        ...siteFrag
      }
    }
    master: authorJson(master: {eq: true}) {
      ...authorFrag
    }
  }
`;
