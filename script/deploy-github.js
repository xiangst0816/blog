const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../.env.github')});

const {cd, exec, touch} = require('shelljs');
const {readFileSync} = require('fs');

const chalk = require('chalk');
console.log(chalk.cyan('-----------------------------'));
console.log(chalk.cyan('Deploying to gh-pages...'));
console.log(chalk.cyan('-----------------------------'));

let repoUrl;
const pkg = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json')));
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section');
  }
  repoUrl = pkg.repository.url;
} else {
  repoUrl = pkg.repository;
}

const ghToken = process.env.GH_TOKEN;

if (!ghToken) {
  throw new Error('Deplay Error: ghToken needed!');
}

const remoteGitStore = `https://${ghToken}@github.com/${repoUrl.split(':')[1]}`;

cd('./public');
touch('.nojekyll');
exec('git init');
exec('git add .');
exec('git config user.name "xiangsongtao"');
exec('git config user.email "280304286@163.com"');
exec('git commit -m "CI(blog): update blog posts."');
exec(`git push --force --quiet "${remoteGitStore}" master:gh-pages`);

console.log(chalk.cyan('---------------'));
console.log(chalk.cyan('Blog deployed!!'));
console.log(chalk.cyan('---------------'));
