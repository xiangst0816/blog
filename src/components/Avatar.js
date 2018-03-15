import React from 'react';
import { withPrefix } from 'gatsby-link';
import PropTypes from 'prop-types';

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
    };
  }

  onLoad = () => {
    this.setState(
      {
        opacity: 1,
      },
      () => {
        console.log('loaded', this.props.avatar);
      }
    );
  };

  render() {
    const { avatar, name, className } = this.props;
    const { opacity } = this.state;
    const avatarUrl =
      avatar && avatar.indexOf('http') > -1 ? avatar : withPrefix(avatar);
    return (
      <figure className={className} title={name}>
        {avatar && (
          <img
            src={avatarUrl}
            style={{ opacity }}
            onLoad={this.onLoad}
            alt={name}
          />
        )}
      </figure>
    );
  }
}

Avatar.propTypes = {
  avatar: PropTypes.string,
};
