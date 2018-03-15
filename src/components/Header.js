import React from 'react';
import classNames from 'classnames';
import registerListener from 'tp-register-listener';
import throttle from 'lodash.throttle';
import Link, { withPrefix } from 'gatsby-link';

let recordPosition = 0;

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.unRegisterListenersCollection = [];
        this.coverElement = null;
        this.state = {
            coverPosition: 0,
            coverActive: !!props.cover,
            coverImage: false,
            direction: false, // false-up; true-down
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
            this.initScroll();
        };
        coverImage.src = coverUrl;
    }

    initScroll = () => {
        if (!this.coverElement) {
            return;
        }

        // if (window.navigator.userAgent.toLowerCase().indexOf('mobile') > -1) {
        //     return;
        // }

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

            // check direction
            if (Math.abs(windowPosition - recordPosition) > 20) {
                if (windowPosition > recordPosition) {
                    if (!this.state.direction) {
                        this.setState({ direction: true }, () => {
                            console.log('up', this.state.direction);
                        });
                    }
                } else {
                    if (this.state.direction) {
                        this.setState({ direction: false }, () => {
                            console.log('down', this.state.direction);
                        });
                    }
                }
                recordPosition = windowPosition;
            }
        }, 16);

        scrollHandler();
        registerListener(window, 'scroll', scrollHandler, { passive: true }, this.unRegisterListenersCollection);
        registerListener(window, 'resize', scrollHandler, { passive: true }, this.unRegisterListenersCollection);
        registerListener(window, 'orientationchange', scrollHandler, { passive: true }, this.unRegisterListenersCollection);
    };

    componentDidMount() {
        this.loadCoverImage();
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
        const { coverPosition, direction, coverActive, coverImage } = this.state;
        const logoUrl = logo && logo.indexOf('http') > -1 ? logo : withPrefix(logo);

        const id = isPost ? 'post-header' : 'blog-header';

        return (
            <header id={id} className={classNames({
                'has-cover': cover,
                'cover-active': coverActive,
                'scroll-down': direction
            })}>
                <div className="inner">
                    <nav id="navigation">
                        {
                            !hideNavBack && (
                                logo ? (
                                    <div className="blog-logo">
                                        <Link to="/"><img src={logoUrl} alt="Blog Logo" /></Link>
                                    </div>
                                ) : (
                                    <div id="home-button" className="nav-button">
                                        <Link className="home-button" to="/" title="Home">
                                            <i className="icon icon-arrow-left"></i> Home
                                        </Link>
                                    </div>
                                )
                            )
                        }
                        {
                            navigation && (
                                <div id="menu-button" onClick={this.toggle} className="nav-button">
                                    <a className="menu-button"><i className="icon icon-menu"></i> Menu</a>
                                </div>
                            )
                        }
                    </nav>
                    {this.props.children}
                    {
                        cover && (
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
