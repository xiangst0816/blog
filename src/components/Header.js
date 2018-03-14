import React from 'react';
import classNames from 'classnames';
import registerListener from 'tp-register-listener';
import throttle from 'lodash.throttle';
import Link, { withPrefix } from 'gatsby-link';
import canScroll from '../utils/can-scroll';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.unRegisterListenersCollection = [];
        this.coverElement = null;
        this.state = {
            coverPosition: 0,
            coverActive: false,
            coverImage: false,
        };
    }

    // maybe to big
    loadCoverImage() {
        const { cover } = this.props;
        if (!cover) return;

        const coverUrl = cover.indexOf('http') > -1 ? cover : withPrefix(cover);
        const coverImage = new Image(coverUrl);
        coverImage.onload = () => {
            this.setState({
                coverImage: coverUrl
            });
        };
        coverImage.src = coverUrl;
    }

    componentDidMount() {
        this.loadCoverImage();

        if (!canScroll) return;
        if (!this.coverElement) return;

        let coverHeight = this.coverElement.offsetHeight;
        const scrollHandler = throttle(() => {
            let windowPosition = window.scrollY;
            if (windowPosition > 0) {
                this.setState({
                    coverPosition: Math.floor(windowPosition * 0.25),
                    coverActive: windowPosition < coverHeight,
                });
            } else {
                this.setState({
                    coverPosition: 0,
                    coverActive: windowPosition < coverHeight,
                });
            }
        }, 16);

        scrollHandler();
        registerListener(window, 'scroll', scrollHandler, { passive: true }, this.unRegisterListenersCollection);
        registerListener(window, 'resize', scrollHandler, { passive: true }, this.unRegisterListenersCollection);
        registerListener(window, 'orientationchange', scrollHandler, { passive: true }, this.unRegisterListenersCollection);
    }

    componentWillUnmount() {
        this.unRegisterListenersCollection.forEach(fn => fn());
    }

    toggle = () => {
        document.documentElement.classList.toggle('menu-active');
    };

    render() {
        const { cover, hideNavBack, navigation, isPost, logo } = this.props;
        const coverClassName = isPost ? 'post-cover' : 'blog-cover';
        const { coverPosition, coverActive, coverImage } = this.state;

        const logoUrl = logo && logo.indexOf('http') > -1 ? logo : withPrefix(logo);

        const BackButton = () => {
            if (logo) {
                return (
                    <div className="blog-logo">
                        <Link to="/"><img src={logoUrl} alt="Blog Logo" /></Link>
                    </div>
                );
            } else {
                return (
                    <div id="home-button" className="nav-button">
                        <Link className="home-button" to="/" title="Home">
                            <i className="icon icon-arrow-left"></i> Home
                        </Link>
                    </div>
                );
            }
        };

        const id = isPost ? 'post-header' : 'blog-header';

        return (
            <header id={id} className={classNames({ 'has-cover': cover, 'cover-active': coverActive })}>
                <div className="inner">
                    <nav id="navigation">
                        {
                            !hideNavBack && <BackButton />
                        }
                        {
                            navigation && (
                                <span id="menu-button" onClick={this.toggle} className="nav-button">
				            <a className="menu-button"><i className="icon icon-menu"></i> Menu</a>
			            </span>
                            )
                        }
                    </nav>
                    {this.props.children}
                    {
                        coverImage && (
                            <div
                                ref={(el) => {
                                    this.coverElement = el;
                                }}
                                className={classNames('cover', coverClassName)}
                                style={{
                                    backgroundImage: `url(${coverImage})`,
                                    transform: `translate3d(0, ${coverPosition}px, 0)`
                                }}
                            ></div>
                        )
                    }
                </div>
            </header>
        );
    }
}
