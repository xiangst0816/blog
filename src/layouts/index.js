import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import '../sass/style.scss';
import 'katex/dist/katex.min.css';

const BUILD_TIME = new Date();

export default class Template extends React.Component {
    static propTypes = {
        children: PropTypes.func,
    };

    componentDidMount() {
        window && window['console'] && window['console'].log(`BUILD_TIME: ${BUILD_TIME}`);
    }

    toggle = () => {
        document.documentElement.classList.toggle('menu-active');
    };

    render() {
        const master = this.props.data.master;
        const site = this.props.data.site.siteMetadata;

        return (
            <section id="wrapper">
                <Helmet
                    title={site.title}
                    meta={[
                        { name: 'description', content: `${site.title}` },
                        { name: 'keywords', content: `${site.keywords}` },
                    ]}
                />
                <Navigation master={master} site={site} {...this.props} />
                <a className="hidden-close" onClick={this.toggle}></a>
                {this.props.children()}
                <div id="body-class" style={{ display: 'none' }} className="tag-template"></div>
                <Footer />
            </section>
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
