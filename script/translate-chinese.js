const http = require('http');
const path = require('path');
const MD5 = require('./md5');

require('dotenv').config({path: path.resolve(__dirname, '../.env')});

const appid = process.env.TRANSLATE_APPID;
const key = process.env.TRANSLATE_KEY;
const url = 'http://api.fanyi.baidu.com/api/trans/vip/translate';

async function translateChinese (text) {
  const salt = (new Date).getTime();
  const query = text;
  const from = 'zh';
  const to = 'en';
  const str1 = appid + query + salt + key;
  const sign = MD5(str1);

  const qsInfo = {
    q: query,
    appid: appid,
    salt: salt,
    from: from,
    to: to,
    sign: sign,
  };

  const qs = Object.keys(qsInfo).
    map(i => `${i}=${encodeURIComponent(qsInfo[i])}`).
    join('&');

  return new Promise((resolve, reject) => {
    http.get(url + '?' + qs, (res) => {
      const {statusCode} = res;
      const contentType = res.headers['content-type'];
      let error;
      if (statusCode !== 200) {
        error = new Error('请求失败\n' +
          `状态码: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('无效的 content-type.\n' +
          `期望的是 application/json 但接收到的是 ${contentType}`);
      }

      if (error) {
        // 消费响应数据来释放内存。
        res.resume();
        reject(error.message);
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          if (parsedData.trans_result &&
            Array.isArray(parsedData.trans_result)) {
            const resList = parsedData.trans_result.map(i => i.dst).
              join(' ').
              split(' ');
            resolve(resList);
          } else {
            reject('未返回数据!');
          }
        } catch (e) {
          reject(e.message);
        }
      });
    }).on('error', (e) => {
      reject(e.message);
    });
  });
}

module.exports = translateChinese;
