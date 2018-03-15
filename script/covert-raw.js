var fs = require('fs');
var _ = require('lodash');
var path = require('path');
const pinyin = require('pinyin');
const rimraf = require('rimraf');
const RawPath = resolve('../raw/');
const BlogPath = resolve('../blog/');
const BackPath = resolve('../backup/');
const author = require('../author/author.json');
const master = author.filter(item => item.master)[0];

fs.readdir(RawPath, function (err, data) {
    if (err) return;
    if (!data || data.length == 0) return;
    console.log(`已完成的原始文档: \n`);
    data.forEach((path) => {
        if (path.split('.')[1] !== 'md') return;
        let title = path.split('.')[0];
        let stat = fs.statSync(`${RawPath}${path}`);
        let date = new Date(stat.birthtime);
        let pathName = title.indexOf(' ') > -1 ? title.split(' ').join('') : title;
        let dirName = getDirName(date, pathName);
        let isDirExist = fs.existsSync(`${BlogPath}${dirName}`);
        if (!isDirExist) {
            fs.mkdirSync(`${BlogPath}${dirName}`);
        }

        let inputData =
            `---` + '\n' +
            `title: ${title}` + '\n' +
            `author: ${master.id}` + '\n' +
            `date: ${(new Date(stat.birthtime)).toISOString()}` + '\n' +
            `draft: false` + '\n' +
            `comments: false` + '\n' +
            `star: false` + '\n' +
            `cover: ''` + '\n' +
            `tags: ` + '\n' +
            `  - 未归档` + '\n' +
            `---` + '\n\n'
        ;
        let readFileData = fs.readFileSync(`${RawPath}${path}`);

        fs.writeFileSync(`${BlogPath}${dirName}/index.md`, inputData + readFileData);

        console.log(`${RawPath}${path}`);

        fs.copyFileSync(`${RawPath}${path}`, `${BackPath}${path}`);

        rimraf(`${RawPath}${path}`, function (err) {
            if (err) return;
        });
    });
});

function getDirName(date, pathName) {
    function withZero(num) {
        if (num < 9) return `0${num}`;
        return `${num}`;
    }

    let _time = `${date.getFullYear()}-${withZero(date.getMonth() + 1)}-${withZero(date.getDate())}`;
    let _name = _.flattenDeep(getPinyin(pathName)).join('-');
    return `${_time}---${_name}`;
}

function getPinyin(str) {
    return pinyin(str, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
        heteronym: true
    });
}

function resolve(dir) {
    return path.join(__dirname, dir);
}
