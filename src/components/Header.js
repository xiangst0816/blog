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
            direction: false, // false-up; true-down
        };
    }

    coverScroll = () => {
        if (!this.coverElement) {
            return;
        }

        const coverHeight = this.coverElement.offsetHeight;
        const coverScrollHandler = throttle(() => {
            const windowPosition = window.scrollY;
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

        coverScrollHandler();
        registerListener(
            window,
            'scroll',
            coverScrollHandler,
            { passive: true },
            this.unRegisterListenersCollection
        );
        registerListener(
            window,
            'resize',
            coverScrollHandler,
            { passive: true },
            this.unRegisterListenersCollection
        );
        registerListener(
            window,
            'orientationchange',
            coverScrollHandler,
            { passive: true },
            this.unRegisterListenersCollection
        );
    };

    navScroll = () => {
        const navScrollHandler = throttle(() => {
            const windowPosition = window.scrollY;
            if (windowPosition < 0) {
                this.setState({ direction: false });
                return;
            }
            // check direction
            if (Math.abs(windowPosition - recordPosition) > 20) {
                if (windowPosition > recordPosition) {
                    if (!this.state.direction) {
                        this.setState({ direction: true });
                    }
                } else if (this.state.direction) {
                    this.setState({ direction: false });
                }
                recordPosition = windowPosition;
            }
        }, 16);

        navScrollHandler();
        registerListener(
            window,
            'scroll',
            navScrollHandler,
            { passive: true },
            this.unRegisterListenersCollection
        );
        registerListener(
            window,
            'resize',
            navScrollHandler,
            { passive: true },
            this.unRegisterListenersCollection
        );
        registerListener(
            window,
            'orientationchange',
            navScrollHandler,
            { passive: true },
            this.unRegisterListenersCollection
        );
    };

    componentDidMount() {
        this.navScroll();
        this.coverScroll();
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
        const { coverPosition, direction, coverActive } = this.state;
        const logoUrl = logo && logo.indexOf('http') > -1 ? logo : withPrefix(logo);
        const coverUrl = cover && cover.indexOf('http') > -1 ? cover : withPrefix(cover);
        const id = isPost ? 'post-header' : 'blog-header';
        return (
            <header
                id={id}
                className={classNames({
                    'has-cover': !!cover,
                    'cover-active': coverActive,
                    'scroll-down': direction,
                })}
            >
                <div className="inner">
                    <nav id="navigation">
                        {!hideNavBack &&
                        (logo ? (
                            <div className="blog-logo">
                                <Link to="/">
                                    <img src={logoUrl} alt="Blog Logo" />
                                </Link>
                            </div>
                        ) : (
                            <div id="home-button" className="nav-button">
                                <Link className="home-button" to="/" title="Home">
                                    <i className="icon icon-arrow-left" /> Home
                                </Link>
                            </div>
                        ))}
                        {navigation && (
                            <div
                                id="menu-button"
                                onClick={this.toggle}
                                className="nav-button"
                            >
                                <a className="menu-button">
                                    <i className="icon icon-menu" /> Menu
                                </a>
                            </div>
                        )}
                    </nav>
                    {this.props.children}
                    {!!cover && (
                        <div
                            ref={el => {
                                this.coverElement = el;
                            }}
                            className={classNames('cover', coverClassName)}
                            style={{
                                backgroundImage: `url(${coverUrl})`,
                                transform: `translate3d(0, ${coverPosition}px, 0)`,
                            }}
                        />
                    )}
                </div>
            </header>
        );
    }
}
