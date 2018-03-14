import React from 'react';

export default () =>
    <div className="page-404">
        <h1>NOT FOUND</h1>
        <p>The page you visited does not exist... the sadness.</p>
        <p className="page-404-back">
            <i className="icon icon-arrow-left"></i>
            <a href="/">Back Home</a>
        </p>
    </div>;
