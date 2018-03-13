import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer id="footer">
                <div className="inner">
                    <section className="credits">
                        <span className="credits-theme">
                            Theme <a href="https://github.com/zutrinken/attila">Attila</a> by <a
                            href="http://zutrinken.com" rel="nofollow">zutrinken</a>
                        </span>
                        <span className="credits-software">Published with <a
                            href="https://github.com/">Github</a></span>
                    </section>
                </div>
                <section className="footer-remark">Made with <span className="love">♥</span> by <a
                    href="https://www.gatsbyjs.org/">Gatsby</a>. Since 2015-2017
                </section>
            </footer>
        );
    }
}
