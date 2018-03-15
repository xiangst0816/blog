import React from 'react';
import classNames from 'classnames';
import kebabCase from 'lodash.kebabcase';
import Link, { withPrefix } from 'gatsby-link';

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
            <li
              className={classNames('nav-home', {
                active: location.pathname === withPrefix('/'),
              })}
              role="presentation"
            >
              <Link to="/">
                <i className="icon icon-home" /> Home
              </Link>
            </li>
            <li
              className={classNames('nav-tags', {
                active: location.pathname === withPrefix('/tags/'),
              })}
              role="presentation"
            >
              <Link to="/tags/">
                <i className="icon icon-price-tags" /> Tags
              </Link>
            </li>
            <li
              className={classNames('nav-author', {
                active: location.pathname.indexOf('author') > -1,
              })}
              role="presentation"
            >
              <Link to={`/author/${author}`}>
                <i className="icon icon-user" /> Author
              </Link>
            </li>
            {site.subscribe && (
              <li className="nav-rss">
                <Link to="/rss.xml">
                  <i className="icon icon-rss" /> Subscribe
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
