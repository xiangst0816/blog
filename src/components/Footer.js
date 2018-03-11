import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer id="footer">
                <div className="inner">
                    <section className="credits">
                        <span className="credits-theme">
                            Theme <a href="https://github.com/zutrinken/attila">Attila</a> by <a href="http://zutrinken.com" rel="nofollow">zutrinken</a>
                        </span>
                        <span className="credits-software">Published with <a href="https://www.gatsbyjs.org/">Gatsby</a></span>
                    </section>
                </div>
            </footer>
        );
    }
}
