const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const pinyin = require('pinyin');
const rimraf = require('rimraf');
const RawPath = resolve('../raw/');
const BlogPath = resolve('../blog/');
const BackPath = resolve('../backup/');
const author = require('../author/author.json');
const master = author.filter(item => item.master)[0];

checkDirExist(RawPath);
checkDirExist(BlogPath);
checkDirExist(BackPath);

fs.readdir(RawPath, (err, data) => {
    if (err) {
        return;
    }
    if (!data || data.length == 0) {
        return;
    }

    const _posts = [];
    const _resources = [];

    data.forEach(path => {
        if (path.match(/^\./)) return;

        if (path.split('.')[1] === 'md') {
            // post
            const readFileData = fs.readFileSync(`${RawPath}${path}`);
            _posts.push({
                path: path,
                title: path.split('.')[0],
                ext: path.split('.')[1],
                raw: readFileData,
                string: readFileData.toString(),
            });
        } else {
            // resources
            _resources.push(path);
        }
    });

    _posts.forEach(post => {
        var tmp = post.string.match(/(?<=\]\().+?(?=\))/ig);
        if (tmp && Array.isArray(tmp)) {
            tmp = tmp.filter(item => item.indexOf('http') === -1);
            if (tmp.length > 0) {
                post.resources = tmp;
            }
        }
    });

    _posts.forEach(post => {
        const { title, path, resources } = post;
        const stat = fs.statSync(`${RawPath}${path}`);
        const date = new Date(stat.birthtime);
        const _pathName =
            title.indexOf(' ') > -1 ? title.split(' ').join('') : title;
        const pathName = _pathName.replace(/\(|\)|\[|\]|\{|\}|，|！|。/g, '');
        const dirName = getDirName(date, pathName);
        checkDirExist(`${BlogPath}${dirName}`);
        const inputData =
            `---` +
            '\n' +
            `title: ${title}` +
            '\n' +
            `author: ${master.id}` +
            '\n' +
            `date: ${new Date(stat.birthtime).toISOString()}` +
            '\n' +
            `draft: false` +
            '\n' +
            `comments: false` +
            '\n' +
            `star: false` +
            '\n' +
            `cover: ''` +
            '\n' +
            `tags: ` +
            '\n' +
            `  - 未归档` +
            '\n' +
            `---` +
            '\n\n';
        const readFileData = fs.readFileSync(`${RawPath}${path}`);
        fs.writeFileSync(
            `${BlogPath}${dirName}/index.md`,
            inputData + readFileData
        );

        if (resources && resources.length > 0) {
            resources.forEach(resource =>{
                fs.copyFileSync(`${RawPath}${resource}`, `${BlogPath}${dirName}/${resource}`);
                fs.copyFileSync(`${RawPath}${resource}`, `${BackPath}/${resource}`);
                rimraf(`${RawPath}/${resource}`, err => {
                    if (err) {
                    }
                });
            })
        }

        fs.copyFileSync(`${RawPath}${path}`, `${BackPath}${path}`);

        rimraf(`${RawPath}${path}`, err => {
          if (err) {
          }
        });
    });
});

function checkDirExist(path) {
    const isDirExist = fs.existsSync(path);
    if (!isDirExist) {
        fs.mkdirSync(path);
    }
}

function getDirName(date, pathName) {
    function withZero(num) {
        if (num < 9) {
            return `0${num}`;
        }
        return `${num}`;
    }

    const _time = `${date.getFullYear()}-${withZero(
        date.getMonth() + 1
    )}-${withZero(date.getDate())}`;
    const _tmp = _.flattenDeep(getPinyin(pathName));
    const _name = _.take(_tmp, 5)
        .join('-')
        .toLowerCase();
    return `${_time}---${_name}`;
}

function getPinyin(str) {
    return pinyin(str, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
        heteronym: false
    });
}

function resolve(dir) {
    return path.join(__dirname, dir);
}
