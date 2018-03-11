const autoprefixer = require('autoprefixer');

module.exports = {
    pathPrefix: process.env.CI ? `/${name}` : `/`,
    siteMetadata: {
        title: `Attila`,
        // cover: 'https://casper.ghost.org/v1.0.0/images/design.jpg',
        cover: 'https://blog.amio.cn/content/images/2016/09/DSC_2972_BG.jpg',
        description: `Thoughts, stories and ideas.`, // 网站描述
        tagCover: 'https://casper.ghost.org/v1.0.0/images/team.jpg',
        siteUrl: '/', // 页面路径
        logo: '',
        navigation: true, // 是否开启右侧导航
        subscribe: true, // 是否显示订阅按钮
    },
    mapping: {
        'MarkdownRemark.frontmatter.author': `AuthorJson`,
    },
    plugins: [
        'gatsby-plugin-react-next',
        `gatsby-transformer-yaml`,
        `gatsby-transformer-json`,
        'gatsby-plugin-catch-links',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/author`,
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/blog`,
                name: 'blog',
            },
        },
        {
            resolve: 'gatsby-plugin-postcss-sass',
            options: {
                postCssPlugins: [autoprefixer()],
                precision: 8,
            },
        },
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            linkImagesToOriginal: false
                        }
                    },
                    {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            // Class prefix for <pre> tags containing syntax highlighting;
                            // defaults to 'language-' (eg <pre class="language-js">).
                            // If your site loads Prism into the browser at runtime,
                            // (eg for use with libraries like react-live),
                            // you may use this to prevent Prism from re-processing syntax.
                            // This is an uncommon use-case though;
                            // If you're unsure, it's best to use the default value.
                            classPrefix: 'language-',
                        },
                    },
                    {
                        resolve: 'gatsby-remark-emojis',
                        options: {
                            // Deactivate the plugin globally (default: true)
                            active: true,
                            // Add a custom css class
                            class: 'emoji-icon',
                            // Select the size (available size: 16, 24, 32, 64)
                            size: 64,
                            // Add custom styles
                            styles: {
                                display: 'inline',
                                margin: '0',
                                'margin-top': '1px',
                                position: 'relative',
                                top: '5px',
                                width: '25px'
                            }
                        }
                    },
                    {
                        resolve: 'gatsby-remark-embed-video',
                        options: {
                            width: 800,
                            ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
                            height: 400, // Optional: Overrides optional.ratio
                        }
                    },
                    'gatsby-remark-autolink-headers',
                    "gatsby-remark-copy-linked-files",
                    "gatsby-remark-responsive-iframe"
                ]
            }
        },
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sharp',
        {
            resolve: 'gatsby-plugin-feed',
            options: {
                query: `
          {
            site {
              siteMetadata {
                siteUrl
                title
                description
              }
            }
          }
        `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => (
                            allMarkdownRemark.edges.map(edge =>
                                Object.assign({}, edge.node.frontmatter, {
                                    tags: edge.node.frontmatter.tags,
                                    date: edge.node.frontmatter.date,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    custom_elements: [{ 'content:encoded': edge.node.html }]
                                }))
                        ),
                        query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        layout
                        draft
                        tags
                      }
                    }
                  }
                }
              }
            `,
                        output: '/rss.xml'
                    }
                ]
            }
        },
    ],
};
