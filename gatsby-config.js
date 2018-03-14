const autoprefixer = require('autoprefixer');

module.exports = {
    pathPrefix: process.env.CI ? `/blog` : `/`,
    siteMetadata: {
        title: `Attila`,
        // cover: 'https://casper.ghost.org/v1.0.0/images/design.jpg',
        // cover: '/background/4.jpg',
        cover: '',
        description: `Thoughts, stories and ideas.`, // 网站描述
        keywords: `Thoughts, stories and ideas.`, // 网站描述
        tagCover: '/background/5.jpg',
        // siteUrl: 'http://10.88.1.158:9000', // 页面路径
        siteUrl: 'https://xiangsongtao.github.io/blog/', // 页面路径
        logo: '',
        language: 'zh-CN',
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
                name: `author`,
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                path: `${__dirname}/static`,
                name: 'static',
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
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            linkImagesToOriginal: false,
                            maxWidth: 840,
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
                    'gatsby-remark-copy-linked-files',
                    'gatsby-remark-katex',
                    'gatsby-remark-responsive-iframe',
                    {
                        resolve: 'gatsby-remark-external-links',
                        options: {
                            target: '_target',
                            rel: 'nofollow'
                        }
                    }
                ]
            }
        },
        'gatsby-plugin-sharp',
        {
            resolve: 'gatsby-plugin-feed',
            options: {
                query: `
                      {
                        site {
                          siteMetadata {
                            title
                            image_url: cover
                            description
                            language
                            siteUrl
                            site_url: siteUrl
                          }
                        }
                      }
                    `,
                // Setup an RSS object, merging on various feed-specific options.
                setup: ({ query: { site: { siteMetadata }, ...rest } }) => {
                    return {
                        ...siteMetadata,
                        ...rest,
                        feed_url: `${siteMetadata.siteUrl}/rss.xml`,
                    };
                },
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => (
                            allMarkdownRemark.edges.map(edge =>
                                Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.html,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    author: edge.node.frontmatter.author.id,
                                }))
                        ),
                        query: `
                              {
                                allMarkdownRemark(
                                  sort: { order: DESC, fields: [frontmatter___date] },
                                  filter: { frontmatter: { draft: { ne: true } } }
                                ) {
                                  edges {
                                    node {
                                      html
                                      excerpt(pruneLength: 260)
                                      fields {
                                        slug
                                      }
                                      frontmatter {
                                        title
                                        date
                                        categories: tags
                                        author {
                                            id
                                        }
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
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: 'UA-114740261-4',
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: 'Attila',
                short_name: 'Attila',
                description: 'Thoughts, stories and ideas.',
                start_url: '/',
                background_color: '#333F44',
                theme_color: '#333F44',
                orientation: 'portrait',
                display: 'standalone', // fullscreen, standalone, minimal-ui, browser
                icons: [
                    // Everything in /static will be copied to an equivalent
                    // directory in /public during development and build, so
                    // assuming your favicons are in /static/favicons,
                    // you can reference them here
                    {
                        "src": "/favicon/ghost-128.png",
                        "sizes": "128x128",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon/ghost-192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon/ghost-256.png",
                        "sizes": "256x256",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon/ghost-512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    },
                    {
                        "src": "/favicon/favicon.ico",
                        "sizes": "64x64"
                    },
                    {
                        "src": "/favicon/ghost-icon.svg",
                        "sizes": "1024x1024"
                    },
                ]
            },
        },
        'gatsby-plugin-offline',
        'gatsby-plugin-react-helmet',
    ],
};
