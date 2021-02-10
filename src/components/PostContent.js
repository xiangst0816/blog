import React from "react"
import registerListener from "tp-register-listener"
import classNames from "classnames"
import PropTypes from "prop-types"

export default class PostContent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.unRegisterListenersCollection = []
    this.postContentElement = null
    this.state = {
      progress: 0,
      isReady: false,
    }
  }

  componentDidMount() {
    const html = document.documentElement
    const viewportHeight = html.clientHeight
    const postHeight = this.postContentElement.offsetHeight
    const postTop = this.postContentElement.offsetTop

    const readingProgress = () => {
      const windowScrollTop = window.scrollY
      requestAnimationFrame(() => {
        if (postHeight >= 1) {
          const postBottom = postTop + postHeight
          const windowBottom = windowScrollTop + viewportHeight
          const progress =
            100 -
            ((postBottom - windowBottom) / (postBottom - viewportHeight)) * 100
          this.setState({
            progress,
            isReady: progress > 100,
          })
        }
      })
    }
    readingProgress()
    registerListener(
      window,
      "scroll",
      readingProgress,
      { passive: true },
      this.unRegisterListenersCollection
    )
    registerListener(
      window,
      "resize",
      readingProgress,
      { passive: true },
      this.unRegisterListenersCollection
    )
    registerListener(
      window,
      "orientationchange",
      readingProgress,
      { passive: true },
      this.unRegisterListenersCollection
    )
  }

  componentWillUnmount() {
    this.unRegisterListenersCollection.forEach(fn => fn())
  }

  render() {
    const { html } = this.props
    const { progress, isReady } = this.state
    return (
      <section
        className="post-content"
        ref={el => {
          this.postContentElement = el
        }}
      >
        <div className={classNames("progress-container", { ready: isReady })}>
          <span className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    )
  }
}

PostContent.propTypes = {
  html: PropTypes.string.isRequired,
}
