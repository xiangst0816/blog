const siteData = require("./site-data")
// const autoprefixer = require("autoprefixer")

const { pathPrefix, trackingId, faviconUrl, start_url } = siteData
const { title, description } = siteData.siteMetadata

module.exports = {
  pathPrefix,
  siteMetadata: siteData.siteMetadata,
  plugins: [
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `#f26a3d`,
        showSpinner: false,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-yaml`,
    `gatsby-transformer-json`,
    "gatsby-plugin-catch-links",
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/content/config`,
    //     name: `config`
    //   }
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/author`,
        name: `author`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog`,
        name: `blog`,
      },
    },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/content/assets`,
    //     name: `assets`
    //   }
    // },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_target",
              rel: "nofollow",
            },
          },
          "gatsby-remark-numbered-footnotes",
          {
            resolve: `gatsby-remark-images`,
            options: {
              showCaptions: true, // TODO: test
              linkImagesToOriginal: false, // TODO: test
              maxWidth: 840,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: "gatsby-remark-emojis",
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: "emoji-icon",
              // Select the size (available size: 16, 24, 32, 64)
              size: 64,
              // Add custom styles
              styles: {
                display: "inline",
                margin: "0",
                "margin-top": "1px",
                position: "relative",
                top: "5px",
                width: "25px",
              },
            },
          },
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
            },
          },
          "gatsby-remark-autolink-headers",
          "gatsby-remark-katex",
          "gatsby-remark-responsive-iframe",
          // 文件放在和文章同文件夹, 引入时别带"/", "./"等参数, 直接写名字
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "post-asset/",
            },
          },
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        // Available options and their defaults:
        base64Width: 20,
        forceBase64Format: ``, // valid formats: png,jpg,webp
        useMozJpeg: process.env.GATSBY_JPEG_ENCODER === `MOZJPEG`,
        stripMetadata: true,
        defaultQuality: 10
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: trackingId,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: title,
        description,
        start_url,
        background_color: "#333F44",
        theme_color: "#333F44",
        orientation: "portrait",
        display: "minimal-ui", // fullscreen, standalone, minimal-ui, browser
        icons: [
          {
            src: faviconUrl,
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
    },
    // {
    //   resolve: `gatsby-plugin-favicon`,
    //   options: {
    //     logo: "./static/favicons/favicon.png",
    //     injectHTML: true,
    //     // dir: 'blog',
    //     icons: {
    //       android: true,
    //       appleIcon: true,
    //       favicons: true,
    //       windows: true,
    //       appleStartup: false,
    //       coast: false,
    //       firefox: false,
    //       twitter: false,
    //       yandex: false,
    //     },
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-feed",
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
          }`,
        // Setup an RSS object, merging on various feed-specific options.
        setup: ({
          query: {
            site: { siteMetadata },
            ...rest
          },
        }) => {
          return {
            ...siteMetadata,
            ...rest,
            feed_url: `${siteMetadata.siteUrl}/rss.xml`,
          }
        },
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge =>
                Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.html,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  author: edge.node.frontmatter.author,
                })
              ),
            query: `{
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
                      author
                    }
                  }
                }
              }
            }`,
            output: "/rss.xml",
          },
        ],
      },
    },
  ],
}
