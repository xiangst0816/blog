import React from 'react';
import classNames from 'classnames';
import registerListener from 'tp-register-listener';
import throttle from 'lodash.throttle';
import canScroll from '../utils/can-scroll';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.unRegisterListenersCollection = [];
        this.coverElement = null;
        this.state = {
            coverPosition: 0,
            coverActive: true,
        };
    }

    componentDidMount() {
        if (!canScroll) return;

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
        // remove all listeners.
        this.unRegisterListenersCollection.forEach(fn => fn());
    }

    toggle = () => {
        document.documentElement.classList.toggle('menu-active');
    };

    render() {
        const { cover, hideNavBack, navigation, isPost, logo } = this.props;
        const coverClassName = isPost ? 'post-cover' : 'blog-cover';
        const { coverPosition, coverActive } = this.state;

        const BackButton = () => {
            if (logo) {
                return (
                    <div className="blog-logo">
                        <a href="/"><img src={logo} alt="Blog Logo" /></a>
                    </div>
                );
            } else {
                return (
                    <div id="home-button" className="nav-button">
                        <a className="home-button" href="/" title="Home">
                            <i className="icon icon-arrow-left"></i> Home
                        </a>
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
                        cover && (
                            <div
                                ref={(el) => {
                                    this.coverElement = el;
                                }}
                                className={classNames('cover', coverClassName)}
                                style={{
                                    backgroundImage: `url(${cover})`,
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
