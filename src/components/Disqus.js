import React from "react"
import ReactDisqusComments from "react-disqus-comments"
import classnames from "classnames"
import siteData from "../../site-data"

const shortName = siteData.shortName

class Disqus extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      // toasts: []
      showDisqus: false,
      disqusLoadedFailure: false,
    }
    // this.notifyAboutComment = this.notifyAboutComment.bind(this);
    // this.onSnackbarDismiss = this.onSnackbarDismiss.bind(this);
  }

  onSnackbarDismiss = () => {
    // const [, ...toasts] = this.state.toasts;
    // this.setState({ toasts });
  }

  notifyAboutComment = () => {
    // const toasts = this.state.toasts.slice();
    // toasts.push({ text: 'New comment available!' });
    // this.setState({ toasts });
  }

  showDisqus = () => {
    this.setState({ showDisqus: true }, () => {
      this.timer = setTimeout(() => {
        if (typeof DISQUS === "undefined") {
          clearTimeout(this.timer)
          this.setState({
            disqusLoadedFailure: true,
          })
        }
      }, 5000)
    })
  }

  render() {
    const { slug, title, showComments } = this.props
    const { showDisqus } = this.state
    if (!shortName || !showComments) {
      return null
    }

    const Content = () => {
      if (!showDisqus) {
        return (
          <a
            id="show-disqus"
            className="post-comments-activate"
            onClick={this.showDisqus}
            rel="noopener noreferrer"
            href="javascript:void(0)"
          >
            Show Comments
          </a>
        )
      } else {
        return (
          <ReactDisqusComments
            shortname={shortName}
            identifier={slug}
            title={title}
            onNewComment={this.notifyAboutComment}
          />
        )
      }
    }

    return (
      <section
        className={classnames("post-comments", { activated: showDisqus })}
      >
        {this.state.disqusLoadedFailure ? (
          <p className="post-comments-disqus-error">
            🚧 Failed to load Disqus!
          </p>
        ) : (
          <Content />
        )}
      </section>
    )
  }
}

export default Disqus
