import React from 'react';
import classNames from 'classnames';
import kebabCase from 'lodash.kebabcase';

export default class Navigation extends React.Component {

    toggle = () => {
        document.documentElement.classList.toggle('menu-active');
    };

    render() {
        const { location, match } = this.props;
        const author = kebabCase(this.props.data.master.id);
        return (
            <nav id="menu" onClick={this.toggle}>
                <a className="close-button">Close</a>
                <div className="nav-wrapper">
                    <p className="nav-label">Menu</p>
                    <ul>
                        <li className={classNames('nav-home', { 'active': location.pathname === '/' })}
                            role="presentation">
                            <a href="/">Home</a>
                        </li>
                        <li className={classNames('nav-tags', { 'active': location.pathname === '/tags/' })}
                            role="presentation">
                            <a href="/tags/">Tags</a>
                        </li>
                        <li className={classNames('nav-author', { 'active': location.pathname.indexOf(author) > -1 })}
                            role="presentation">
                            <a href={`/author/${author}`}>Author</a>
                        </li>

                        {/*{{#if @blog.twitter}}*/}
                        {/*<li className="nav-twitter"><a href="{{twitter_url}}" title="{{@blog.twitter}}"><i*/}
                        {/*className="ic ic-twitter"></i> Twitter</a></li>*/}
                        {/*{{/if}}*/}
                        {/*<li className="nav-facebook"><a href="{{facebook_url}}" title="{{@blog.facebook}}"><i*/}
                        {/*className="ic ic-facebook"></i> Facebook</a></li>*/}
                        {/*{{#if @labs.subscribers}}*/}
                        {/*<li className="nav-subscribe"><a href="{{@blog.url}}/subscribe/"><i*/}
                        {/*className="ic ic-mail"></i> Subscribe</a></li>*/}
                        {/*{{else}}*/}
                        <li className="nav-rss"><a href="/rss.xml"><i className="ic ic-rss"></i> Subscribe</a>
                        </li>
                        {/*{{/if}}*/}
                    </ul>
                </div>
            </nav>
        );
    }
}
