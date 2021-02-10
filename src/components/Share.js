import React from "react"
import PropTypes from "prop-types"

export default class Share extends React.PureComponent {
  render() {
    const { title, url } = this.props
    return (
      <div className="post-share">
        <a
          className="twitter"
          href={`https://twitter.com/share?text=${title}&url=${url}`}
          onClick={() => {
            window.open(this.href, "twitter-share", "width=550,height=235")
            return false
          }}
        >
          <i className="icon icon-twitter" />
          <span className="hidden">Twitter</span>
        </a>
        <a
          className="facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          onClick={() => {
            window.open(this.href, "facebook-share", "width=580,height=296")
            return false
          }}
        >
          <i className="icon icon-facebook" />
          <span className="hidden">Facebook</span>
        </a>
        <a
          className="googleplus"
          href={`https://plus.google.com/share?url=${url}`}
          onClick={() => {
            window.open(this.href, "google-plus-share", "width=490,height=530")
            return false
          }}
        >
          <i className="icon icon-googleplus" />
          <span className="hidden">Google+</span>
        </a>
        <div className="clear" />
      </div>
    )
  }
}

Share.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}
