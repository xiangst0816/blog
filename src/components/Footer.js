import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer id="footer">
                <div className="inner">
                    <section className="credits">
                        <span className="credits-theme">
                            Theme <a target="_target" href="https://github.com/zutrinken/attila">Attila</a> by <a
                            href="http://zutrinken.com" target="_target" rel="nofollow">zutrinken</a> && Made with <span
                            className="love">♥</span> by <a
                            target="_target"
                            href="https://www.gatsbyjs.org/">Gatsby</a>, Since 2015-{new Date().getFullYear()}. ©All Rights.
                        </span>
                    </section>
                </div>
            </footer>
        );
    }
}
