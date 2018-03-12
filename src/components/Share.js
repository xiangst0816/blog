import React from 'react';

export default class Share extends React.Component {
    componentDidMount() {
        this.url = location && location.href;
    }

    render() {
        const title = this.props.title;
        const url = this.url;
        return (
            <div className="post-share">
                <a className="twitter"
                   href={`https://twitter.com/share?text=${title}&url=${url}`}
                   onClick={() => {
                       window.open(this.href, 'twitter-share', 'width=550,height=235');
                       return false;
                   }}>
                    <i className="icon icon-twitter"></i><span className="hidden">Twitter</span>
                </a>
                <a className="facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                   onClick={() => {
                       window.open(this.href, 'facebook-share', 'width=580,height=296');
                       return false;
                   }
                   }>
                    <i className="icon icon-facebook"></i><span className="hidden">Facebook</span>
                </a>
                <a className="googleplus" href={`https://plus.google.com/share?url=${url}`}
                   onClick={() => {
                       window.open(this.href, 'google-plus-share', 'width=490,height=530');
                       return false;
                   }
                   }>
                    <i className="icon icon-googleplus"></i><span className="hidden">Google+</span>
                </a>
                <div className="clear"></div>
            </div>
        );
    }
}

