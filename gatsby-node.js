/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")
const _ = require("lodash")
const slash = require("slash")
const authors = require("./author/author") || []
const defaultAuthor = authors.filter(
  author => author.master && author.master === true
)[0]
const kebabCase = require("lodash.kebabcase")

// Add synchronized dynamic html pages
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const queryInfo = graphql(`
    query queryInfo {
      allMarkdownRemark(
        filter: { frontmatter: { draft: { ne: true } } }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        totalCount
        postEdges: edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
      allTags: allMarkdownRemark(
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
      allAuthor: allMarkdownRemark(
        filter: { frontmatter: { draft: { ne: true } } }
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        totalCount
        group(field: frontmatter___author) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  return new Promise((resolve, reject) => {
    queryInfo
      .then(result => {
        if (result.errors) {
          console.log("result:")
          console.log(result)
          reject()
        }

        const { postEdges, totalCount } = _.get(
          result,
          "data.allMarkdownRemark",
          {}
        )
        const { group: authors } = result.data.allAuthor || { group: [] }
        const { group: tags } = result.data.allTags
        const tagObj = {}

        tags.forEach(tagInfo => {
          tagObj[tagInfo.fieldValue] = tagInfo.totalCount
        })

        const authorObj = {}
        authors.forEach(authorInfo => {
          authorObj[authorInfo.fieldValue] = authorInfo.totalCount
        })

        // Create blog posts pages.
        createBlogPost(postEdges, createPage)
        // Tag pages.
        createTagPage(tagObj, createPage)
        // Author pages
        createAuthorPage(authorObj, createPage);
        // Pagination
        createIndexPagination(totalCount, createPage)

        resolve()
      })
      .catch(e => {
        console.log(e)
      })
  })
}

// Add custom url pathname for blog posts.
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    setDefaultAuthor(node.frontmatter)
  }

  if (node.internal.type === `File`) {
    const absolutePath = slash(node.absolutePath)
    const parsedFilePath = path.parse(absolutePath)
    const slug = `/${parsedFilePath.dir.split("---")[1]}/`
    // const dir = parsedFilePath.dir.split("/").slice(-1)[0];
    createNodeField({ node, name: `slug`, value: slug })
  } else if (
    node.internal.type === `MarkdownRemark` &&
    typeof node.slug === "undefined"
  ) {
    const fileNode = getNode(node.parent)
    createNodeField({
      node,
      name: `slug`,
      value: fileNode.fields.slug,
    })
    createNodeField({
      node,
      name: `relativePath`,
      value: fileNode.relativePath,
    })
  }
}

// create Index pages with pagination, 添加额外分页页面
function createIndexPagination(total, createPage) {
  const limit = 10
  const count = Math.ceil(total / limit)
  const indexPage = path.resolve("src/pages/index.js")
  for (let i = 1; count + 1 > i; i++) {
    createPage({
      path: `/page/${i}`,
      component: indexPage,
      context: {
        skip: (i - 1) * limit,
        limit: limit,
      },
    })
  }
}

// Tag pages.
function createTagPage(tagObj, createPage) {
  const limit = 10
  const tagPages = path.resolve("src/templates/tag-page.js")
  const tagList = Object.keys(tagObj)
  tagList.forEach(tag => {
    const postCount = tagObj[tag]
    const kebabCaseName = kebabCase(tag)
    createPage({
      path: `/tag/${kebabCaseName}/`,
      component: tagPages,
      context: {
        tag,
      },
    })

    const count = Math.ceil(postCount / limit)
    for (let i = 1; count + 1 > i; i++) {
      createPage({
        path: `/tag/${kebabCaseName}/${i}`,
        component: tagPages,
        context: {
          skip: (i - 1) * limit,
          limit: limit,
          tag,
        },
      })
    }
  })
}

// Create Author pages.
function createAuthorPage(authorObj, createPage) {
  const limit = 10
  const authorPage = path.resolve("src/templates/author-page.js")
  const authorList = Object.keys(authorObj)
  authorList.forEach(author => {
    const postCount = authorObj[author]
    const kebabCaseName = kebabCase(author)
    createPage({
      path: `/author/${kebabCaseName}/`, // required
      component: authorPage,
      context: {
        author,
      },
    })

    const count = Math.ceil(postCount / limit)
    for (let i = 1; count + 1 > i; i++) {
      createPage({
        path: `/author/${kebabCaseName}/${i}`,
        component: authorPage,
        context: {
          skip: (i - 1) * limit,
          limit: limit,
          author,
        },
      })
    }
  })
}

// Create blog posts pages.
function createBlogPost(edges, createPage) {
  const blogPost = path.resolve("src/templates/blog-post.js")
  edges.forEach((edge, index) => {
    const { slug } = edge.node.fields
    const prev = index === 0 ? "" : edges[index - 1].node.fields.slug
    const next =
      index === edges.length - 1 ? "" : edges[index + 1].node.fields.slug

    createPage({
      path: slug, // required
      component: blogPost,
      context: {
        curr: slug,
        prev,
        next,
      },
    })
  })
}

// Articles with no name specified as master
function setDefaultAuthor(frontmatter) {
  if (!defaultAuthor || JSON.stringify(defaultAuthor) === "{}") {
    return
  }
  if (!frontmatter.author) {
    frontmatter.author = defaultAuthor.id
  }
}
