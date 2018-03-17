import React from 'react';
import PropTypes from 'prop-types';
import logo from '../static/favicons/favicon.png';

let inlinedStyles = '';
if (process.env.NODE_ENV === 'production') {
    try {
        /* eslint import/no-webpack-loader-syntax: off */
        inlinedStyles = require('!raw-loader!../public/styles.css');
    } catch (e) {
        /* eslint no-console: "off" */
    }
}

export default class HTML extends React.Component {
    render() {
        let css;
        if (process.env.NODE_ENV === 'production') {
            css = (
                <style
                    id="gatsby-inlined-css"
                    dangerouslySetInnerHTML={{ __html: inlinedStyles }}
                />
            );
        }

        return (
            <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta name="HandheldFriendly" content="True" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <meta name="format-detection" content="telephone=no email=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <link rel="icon" type="image/png" sizes="1024x1024" href={logo} />
                {this.props.headComponents}
                {css}
            </head>
            <body className="tag-template">
            <div
                id="___gatsby"
                dangerouslySetInnerHTML={{ __html: this.props.body }}
            />
            {this.props.postBodyComponents}
            </body>
            </html>
        );
    }
}

HTML.propTypes = {
    body: PropTypes.string.isRequired,
    headComponents: PropTypes.array.isRequired,
    preBodyComponents: PropTypes.array.isRequired,
    postBodyComponents: PropTypes.array.isRequired,
};
