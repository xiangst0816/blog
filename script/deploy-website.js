'use strict';
var path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
var gulp = require('gulp');
// https://github.com/teambition/gulp-ssh
var GulpSSH = require('gulp-ssh');
var publicPath = resolve('public');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

var config = {
    host: process.env.WEBSITE_HOST,
    port: process.env.WEBSITE_PORT,
    username: process.env.WEBSITE_USER,
    password: process.env.WEBSITE_PSW,
};

var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: config
});

gulp.task('exec', function () {
    return gulpSSH
        .exec(['uptime', 'ls -a', 'pwd'], { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'));
});

gulp.task('dest', function () {
    return gulp
        .src([`${publicPath}/**/*.*`, `!${publicPath}/**/*.*.map`])
        .pipe(gulpSSH.dest(process.env.WEBSITE_DST));
});

// gulp.task('shell', function () {
//     return gulpSSH
//         .shell(['pm2 restart attila'], {filePath: 'shell.log'})
//         .pipe(gulp.dest('logs'))
// })

gulp.task('deploy', ['dest'], function () {
    return gulpSSH
        .shell(['nginx -s reload'], { filePath: 'shell.log' })
        .pipe(gulp.dest('logs'));
});

// gulp.task('sftp-read', function () {
//     return gulpSSH.sftp('read', '/home/iojs/test/gulp-ssh/index.js', {filePath: 'index.js'})
//         .pipe(gulp.dest('logs'))
// })
//
// gulp.task('sftp-write', function () {
//     return gulp.src('index.js')
//         .pipe(gulpSSH.sftp('write', '/home/iojs/test/gulp-ssh/test.js'))
// })
//
// gulp.task('shell', function () {
//     return gulpSSH
//         .shell(['cd /home/iojs/test/thunks', 'git pull', 'npm install', 'npm update', 'npm test'], {filePath: 'shell.log'})
//         .pipe(gulp.dest('logs'))
// })
