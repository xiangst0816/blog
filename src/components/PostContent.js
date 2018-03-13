import React from 'react';
import registerListener from 'tp-register-listener';
import classNames from 'classnames';
import canScroll from '../utils/can-scroll';

export default class PostContent extends React.Component {
    constructor(props) {
        super(props);
        this.unRegisterListenersCollection = [];
        this.postContentElement = null;
        this.state = {
            progress: 0,
            isReady: false,
        };
    }

    componentDidMount() {
        if (!canScroll) return;

        let html = document.documentElement;
        let viewportHeight = html.clientHeight;
        let postHeight = this.postContentElement.offsetHeight;
        let postTop = this.postContentElement.offsetTop;
        const readingProgress = () => {
            let windowScrollTop = window.scrollY;
            if (postHeight >= 1) {
                let postBottom = postTop + postHeight;
                let windowBottom = windowScrollTop + viewportHeight;
                let progress = 100 - (((postBottom - windowBottom) / (postBottom - viewportHeight)) * 100);
                this.setState({
                    progress,
                    isReady: progress > 100,
                });
            }
        };
        readingProgress();
        registerListener(window, 'scroll', readingProgress, { passive: true }, this.unRegisterListenersCollection);
        registerListener(window, 'resize', readingProgress, { passive: true }, this.unRegisterListenersCollection);
        registerListener(window, 'orientationchange', readingProgress, { passive: true }, this.unRegisterListenersCollection);
    }

    componentWillUnmount() {
        this.unRegisterListenersCollection.forEach(fn => fn());
    }

    render() {
        const { html } = this.props;
        const { progress, isReady } = this.state;
        return (
            <section
                className="post-content"
                ref={(el) => {
                    this.postContentElement = el;
                }}
            >
                <div className={classNames('progress-container', { 'ready': isReady })}>
                    <span className="progress-bar" style={{ width: `${progress}%` }}></span>
                </div>
                <article dangerouslySetInnerHTML={{ __html: html }} />
            </section>
        );
    }
}
