import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import '../sass/style.scss';

const BUILD_TIME = new Date().getTime();

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
        return (
            <section id="wrapper">
                <Helmet
                    title="Gatsby Default (Blog) Starter"
                    meta={[
                        { name: 'description', content: 'Sample' },
                        { name: 'keywords', content: 'sample, something' },
                    ]}
                />
                <Navigation {...this.props} />
                <a className="hidden-close" onClick={this.toggle}></a>
                {this.props.children()}
                <div id="body-class" style={{ display: 'none' }} className="tag-template tag-getting-started"></div>
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

  query LayoutQuery{
    master: authorJson(master: {eq: true}) {
      ...authorFrag
    }
  }
`;
