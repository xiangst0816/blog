import React from "react"

export default class Footer extends React.PureComponent {
  render() {
    return (
      <footer id="footer">
        <div className="inner">
          <section className="credits">
            <span className="credits-theme">
              Theme{" "}
              <a
                target="_target"
                href="https://github.com/zutrinken/attila"
                rel="noopener noreferrer"
              >
                Attila
              </a>{" "}
              by{" "}
              <a
                href="http://zutrinken.com"
                target="_target"
                rel="noopener noreferrer"
              >
                zutrinken
              </a>{" "}
              , Made with <span className="love">♥</span> by{" "}
              <a
                target="_target"
                href="https://www.gatsbyjs.org/"
                rel="noopener noreferrer"
              >
                Gatsby
              </a>
              , Since 2015-{new Date().getFullYear()}. ©All Rights.
            </span>
          </section>
        </div>
      </footer>
    )
  }
}
