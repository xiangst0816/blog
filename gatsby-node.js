const path = require('path');
const webpackLodashPlugin = require('lodash-webpack-plugin');
const slash = require('slash');
const authors = require('./author/author.json');
const defaultAuthor = authors.filter(author => author.master === true)[0];
var kebabCase = require('lodash.kebabcase');

// Add synchronized dynamic html pages
exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators;
    const queryInfo = graphql(`
      query queryInfo{
        allMarkdownRemark(
          filter: {frontmatter: {draft: {ne: true}}}
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
        allAuthorJson {
          authorEdges: edges {
            node {
              id
            }
          }
        }
      }
    `);
    return new Promise((resolve) => {
        queryInfo.then(result => {
            if (result.errors) {
                console.log(result.errors);
                resolve();
            }

            const { postEdges, totalCount } = result.data.allMarkdownRemark;
            const { authorEdges } = result.data.allAuthorJson;
            // Create blog posts pages.
            createBlogPost(postEdges, createPage);
            // Tag pages.
            createTagPage(postEdges, createPage);
            // Author pages
            createAuthorPage(authorEdges, createPage);

            // Pagination
            createIndexPagination(totalCount, authorEdges, createPage);

            resolve();
        });
    });
};


// Add custom url pathname for blog posts.
exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
    const { createNodeField } = boundActionCreators;

    if (node.internal.type === `MarkdownRemark`) {
        setDefaultAuthor(node.frontmatter);
    }

    if (node.internal.type === `File`) {
        const absolutePath = slash(node.absolutePath);
        const parsedFilePath = path.parse(absolutePath);
        const slug = `/${parsedFilePath.dir.split('---')[1]}/`;
        createNodeField({ node, name: `slug`, value: slug });
    } else if (
        node.internal.type === `MarkdownRemark` &&
        typeof node.slug === 'undefined'
    ) {
        const fileNode = getNode(node.parent);
        createNodeField({
            node,
            name: `slug`,
            value: fileNode.fields.slug,
        });
    }
};


// Add Lodash plugin
exports.modifyWebpackConfig = ({ config, stage }) => {
    if (stage === `build-javascript`) {
        config.plugin(`Lodash`, webpackLodashPlugin, null);
    }

    return;
};

// create Index pages with pagination, 添加额外分页页面
function createIndexPagination(total, edges, createPage) {
    let limit = 10;
    let count = Math.ceil(total / limit);
    const indexPage = path.resolve('src/pages/index.js');
    for (let i = 1; count + 1 > i; i++) {
        createPage({
            path: `/page/${i}`,
            component: indexPage,
            context: {
                skip: (i - 1) * limit,
                limit: limit,
            },
        });
    }
}

// Create Author pages.
function createAuthorPage(edges, createPage) {
    const authorPage = path.resolve('src/templates/author-page.js');
    edges.forEach(edge => {
        createPage({
            path: `/author/${kebabCase(edge.node.id)}`, // required
            component: authorPage,
            context: {
                author: edge.node.id,
            },
        });
    });
}

// Create blog posts pages.
function createBlogPost(edges, createPage) {
    const blogPost = path.resolve('src/templates/blog-post.js');
    edges.forEach((edge, index) => {
        const { slug } = edge.node.fields;
        const prev = index === 0 ? '' : edges[index - 1].node.fields.slug;
        const next = index === edges.length - 1 ? '' : edges[index + 1].node.fields.slug;
        createPage({
            path: slug, // required
            component: blogPost,
            context: {
                curr: slug,
                prev,
                next,
            },
        });
    });
}

// Tag pages.
function createTagPage(edges, createPage) {
    const tagPages = path.resolve('src/templates/tag-page.js');
    const tagSet = new Set();
    edges.forEach(edge => {
        edge.node.frontmatter.tags && edge.node.frontmatter.tags.forEach(tag => {
            tagSet.add(tag);
        });
    });
    const tagList = Array.from(tagSet);
    tagList.forEach(tag => {
        createPage({
            path: `/tag/${kebabCase(tag)}/`,
            component: tagPages,
            context: {
                tag,
            },
        });
    });
}

// Articles with no name specified as master
function setDefaultAuthor(frontmatter) {
    if (!defaultAuthor || JSON.stringify(defaultAuthor) === '{}') return;
    if (!frontmatter.author) {
        frontmatter.author = defaultAuthor.id;
    }
}
