import React from 'react';

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
                        <a className="pagination-prev" href={prev}><i className="icon icon-arrow-left"></i>
                            <span className="pagination-label">Newer Posts</span></a>
                    )}
                    {
                        pages && <span className="pagination-info">Page {page} of {pages}</span>
                    }
                    {next && (
                        <a className="pagination-next" href={next}><span className="pagination-label">Older Posts</span>
                            <i className="icon icon-arrow-right"></i></a>
                    )}
                    <div className="clear"></div>
                </div>
            </nav>
        );
    }
}
