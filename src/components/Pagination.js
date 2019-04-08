import React from 'react';
import { Link } from "gatsby";
import PropTypes from 'prop-types';

export default class Pagination extends React.PureComponent {
  render() {
    const { skip = 0, limit = 10, total, pathPrefix = '/page/' } = this.props;
    const page = skip / limit + 1;
    const pages = Math.ceil(total / limit);
    const prev = page - 1 > 0 ? `${pathPrefix}${page - 1}` : null;
    const next = pages > page ? `${pathPrefix}${page + 1}` : null;

    return (
      <nav className="pagination">
        <div className="inner">
          {prev && (
            <Link className="pagination-prev" to={prev}>
              <i className="icon icon-arrow-left" />
              <span className="pagination-label">Newer Posts</span>
            </Link>
          )}
          {pages && (
            <span className="pagination-info">
              Page {page} of {pages}
            </span>
          )}
          {next && (
            <Link className="pagination-next" to={next}>
              <span className="pagination-label">Older Posts</span>
              <i className="icon icon-arrow-right" />
            </Link>
          )}
          <div className="clear" />
        </div>
      </nav>
    );
  }
}

Pagination.propTypes = {
  pathPrefix: PropTypes.string,
  skip: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
};
