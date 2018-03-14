import React from 'react';
import Link from 'gatsby-link';

export default class Pagination extends React.Component {
    render() {
        const { skip = 0, limit = 10, total, pathPrefix = '/page/' } = this.props;
        const page = skip / limit + 1;
        const pages = Math.ceil(total / limit);
        const prev = page - 1 > 0 ? `${pathPrefix}${page - 1}` : null;
        const next = pages > page ? `${pathPrefix}${page + 1}` : null;
        return (
            <nav className="pagination" role="pagination">
                <div className="inner">
                    {prev && (
                        <Link className="pagination-prev" to={prev}><i className="icon icon-arrow-left"></i>
                            <span className="pagination-label">Newer Posts</span></Link>
                    )}
                    {
                        pages && <span className="pagination-info">Page {page} of {pages}</span>
                    }
                    {next && (
                        <Link className="pagination-next" to={next}><span className="pagination-label">Older Posts</span>
                            <i className="icon icon-arrow-right"></i></Link>
                    )}
                    <div className="clear"></div>
                </div>
            </nav>
        );
    }
}
