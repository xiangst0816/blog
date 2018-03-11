import React from 'react';
import classNames from 'classnames';
import kebabCase from 'lodash.kebabcase';

export default class Navigation extends React.Component {

    toggle = () => {
        document.documentElement.classList.toggle('menu-active');
    };

    render() {
        const { location } = this.props;
        const { master, site } = this.props;
        const author = kebabCase(master.id);
        return (
            <nav id="menu" onClick={this.toggle}>
                <a className="close-button">Close</a>
                <div className="nav-wrapper">
                    <p className="nav-label">Menu</p>
                    <ul>
                        <li className={classNames('nav-home', { 'active': location.pathname === '/' })}
                            role="presentation">
                            <a href="/"><i className="ic icon-home"></i> Home</a>
                        </li>
                        <li className={classNames('nav-tags', { 'active': location.pathname === '/tags/' })}
                            role="presentation">
                            <a href="/tags/"><i className="ic icon-price-tags"></i> Tags</a>
                        </li>
                        <li className={classNames('nav-author', { 'active': location.pathname.indexOf(author) > -1 })}
                            role="presentation">
                            <a href={`/author/${author}`}><i className="ic icon-user"></i> Author</a>
                        </li>
                        {
                            site.subscribe && (
                                <li className="nav-rss">
                                    <a href="/rss.xml"><i className="ic icon-rss"></i> Subscribe</a>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </nav>
        );
    }
}
