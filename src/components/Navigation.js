import React from "react"
import classNames from "classnames"
import kebabCase from "lodash.kebabcase"
import { Link } from "gatsby"
import withPrefix from "../utils/with-prefix"

export default class Navigation extends React.PureComponent {
  toggle = () => {
    document.documentElement.classList.toggle("menu-active")
  }

  render() {
    const { location } = this.props
    const { master, site } = this.props
    const author = kebabCase(master.id)
    const { subscribe } = site.siteMetadata

    return (
      <nav id="menu" onClick={this.toggle}>
        <div className="close-button">Close</div>
        <div className="nav-wrapper">
          <p className="nav-label">Menu</p>
          <ul>
            <li
              className={classNames("nav-home", {
                active: location.pathname === withPrefix("/"),
              })}
              role="presentation"
            >
              <Link to="/">
                <i className="icon icon-home" /> Home
              </Link>
            </li>
            <li
              className={classNames("nav-tags", {
                active: location.pathname === withPrefix("/tags/"),
              })}
              role="presentation"
            >
              <Link to="/tags/">
                <i className="icon icon-price-tags" /> Tags
              </Link>
            </li>
            <li
              className={classNames("nav-archive", {
                active: location.pathname === withPrefix("/archive/"),
              })}
              role="presentation"
            >
              <Link to={`/archive/`}>
                <i className="icon icon-database" /> Archive
              </Link>
            </li>
            <li
              className={classNames("nav-author", {
                active: location.pathname.indexOf("author") > -1,
              })}
              role="presentation"
            >
              <Link to={`/author/${author}`}>
                <i className="icon icon-user" /> Author
              </Link>
            </li>
            {/*<li*/}
            {/*className={classNames('nav-author', {*/}
            {/*active: location.pathname.indexOf('author') > -1,*/}
            {/*})}*/}
            {/*role="presentation"*/}
            {/*>*/}
            {/*<Link to={`/author/${author}`}>*/}
            {/*<i className="icon icon-profile" /> Hire Me*/}
            {/*</Link>*/}
            {/*</li>*/}
            {subscribe && (
              <li className="nav-rss">
                <Link to="/rss.xml">
                  <i className="icon icon-rss" /> Subscribe
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    )
  }
}
