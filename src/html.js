import React from 'react';
import PropTypes from 'prop-types';


let inlinedStyles = '';
if (process.env.NODE_ENV === 'production') {
    try {
        /* eslint import/no-webpack-loader-syntax: off */
        inlinedStyles = require('!raw-loader!../public/styles.css');
    } catch (e) {
        /* eslint no-console: "off"*/
        console.log(e);
    }
}

export default class HTML extends React.Component {
    static propTypes = {
        body: PropTypes.string,
        headComponents: PropTypes.array,
        preBodyComponents: PropTypes.array,
        postBodyComponents: PropTypes.array,
    };

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
            <html>
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta name="HandheldFriendly" content="True" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
