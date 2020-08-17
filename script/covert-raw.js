const fs = require("fs")
const _ = require("lodash")
const pathFn = require("path")
const pinyin = require("pinyin")
const rimraf = require("rimraf")
const RawPath = pathFn.join(__dirname, "../", "raw")
const BlogPath = pathFn.join(__dirname, "../", "blog")
const BackPath = pathFn.join(__dirname, "../", "backup")
const author = require("../author/author.json")
const translateChinese = require("./translate-chinese")
const master = author.filter(item => item.master)[0]

checkDirExist(RawPath)
checkDirExist(BlogPath)
checkDirExist(BackPath)

fs.readdir(RawPath, (err, data) => {
  if (err) {
    return
  }
  if (!data || data.length == 0) {
    return
  }

  const _posts = []
  const _resources = []

  data.forEach(path => {
    // 排除隐藏文件
    if (path.match(/^\./)) return

    const extname = pathFn.extname(path)
    if (extname.includes(".md")) {
      // post md文件处理
      const readFileData = fs.readFileSync(pathFn.resolve(RawPath, path))
      _posts.push({
        path: path,
        title: path.split(".")[0],
        ext: path.split(".")[1],
        raw: readFileData,
        string: readFileData.toString(),
      })
    } else {
      // resources 其余资源文件处理
      if (/\.(png|svg|eot|ttf|woff|jpg|jpeg|pdf|mp4|mp3)$/i.test(extname)) {
        _resources.push(path)
      }
    }
  })

  if (_posts.length === 0) return

  _posts.forEach(post => {
    var tmp = post.string.match(/(?<=\]\().+?(?=\))/gi)
    if (tmp && Array.isArray(tmp)) {
      tmp = tmp.filter(item => {
        var _res = item.match(
          /.+?\.(png|svg|eot|ttf|woff|jpg|jpeg|pdf|mp4|mp3)/gi
        )
        let isSource = _res && _res.length > 0
        let isUrl = item.indexOf("http") > -1
        return isSource && !isUrl
      })

      if (tmp.length > 0) {
        post.resources = tmp
      }
    }
  })

  _posts.forEach(async post => {
    const { title, path, resources } = post

    const RawPathWithCurrentPath = pathFn.resolve(RawPath, path)

    const stat = fs.statSync(RawPathWithCurrentPath)
    const date = new Date(stat.birthtime)

    const postTitle = (title || "")
      .trim()
      .match(/\w+|[\u4e00-\u9fa5]/gi)
      .join("")

    const dirName = await getDirName(date, postTitle)
    checkDirExist(pathFn.resolve(BlogPath, dirName))
    const inputData =
      `---` +
      "\n" +
      `title: ${title}` +
      "\n" +
      `author: ${master.id}` +
      "\n" +
      `date: ${new Date(stat.birthtime).toISOString()}` +
      "\n" +
      `draft: false` +
      "\n" +
      `comments: true` +
      "\n" +
      `star: false` +
      "\n" +
      `cover: ''` +
      "\n" +
      `tags: ` +
      "\n" +
      `  - 未归档` +
      "\n" +
      `---` +
      "\n\n"
    let readFileData = fs.readFileSync(RawPathWithCurrentPath, {
      encoding: "utf8",
    })

    // post resource transform
    if (resources && resources.length > 0) {
      resources.forEach(resource => {
        if (!pathFn.isAbsolute(resource) && !/^http/.test(resource)) {
          const RawPathWithCurrentResourcePath = pathFn.resolve(
            RawPath,
            resource
          )
          const BackPathCurrentResourcePath = pathFn.resolve(BackPath, resource)
          const BlogPathCurrentResourcePath = pathFn.resolve(
            BlogPath,
            dirName,
            resource
          )

          fs.copyFileSync(
            RawPathWithCurrentResourcePath,
            BlogPathCurrentResourcePath
          )
          fs.copyFileSync(
            RawPathWithCurrentResourcePath,
            BackPathCurrentResourcePath
          )
        } else if (pathFn.isAbsolute(resource)) {
          const RawPathWithCurrentResourcePath = resource
          const ImagePath = pathFn.resolve(BlogPath, dirName, "images")
          const BackPathCurrentResourcePath = pathFn.resolve(BackPath, resource)

          if (!fs.existsSync(ImagePath)) {
            fs.mkdirSync(ImagePath)
          }

          const basename = pathFn.basename(resource)
          const BlogPathCurrentResourcePath = pathFn.resolve(
            ImagePath,
            basename
          )

          fs.copyFileSync(
            RawPathWithCurrentResourcePath,
            BlogPathCurrentResourcePath
          )

          readFileData = (readFileData || "").replace(
            new RegExp(`(${RawPathWithCurrentResourcePath})`),
            `images/${basename}`
          )
        }
      })
    }

    // post transform
    fs.writeFileSync(
      pathFn.resolve(BlogPath, dirName, "index.md"),
      inputData + readFileData
    )
    fs.copyFileSync(RawPathWithCurrentPath, pathFn.resolve(BackPath, path))

    rimraf(RawPathWithCurrentPath, err => {
      if (err) {
      }
    })
  })
})

function checkDirExist(path) {
  const isDirExist = fs.existsSync(path)
  if (!isDirExist) {
    fs.mkdirSync(path)
  }
}

async function getDirName(date, postTitle) {
  function withZero(num) {
    return num < 9 ? `0${num}` : `${num}`
  }

  const fullYear = date.getFullYear().toString()

  const _time = `${fullYear}-${withZero(date.getMonth() + 1)}-${withZero(
    date.getDate()
  )}`

  let _tmp = []

  try {
    _tmp = await translateChinese(postTitle)
  } catch (e) {}

  if (!_tmp || !Array.isArray(_tmp) || _tmp.length === 0) {
    _tmp = _.flattenDeep(getPinyin(postTitle))
  }

  const _name = _tmp.join("-").toLowerCase()

  checkDirExist(pathFn.resolve(BlogPath, fullYear))

  return `${fullYear}/${_time}---${_name}`
}

function getPinyin(str) {
  return pinyin(str, {
    style: pinyin.STYLE_NORMAL, // 设置拼音风格
    heteronym: false,
  })
}
