import React from "react"
import Footer from "./Footer"
import Navigation from "./Navigation"
import "../sass/style.scss"
import "katex/dist/katex.min.css"
import { StaticQuery, graphql } from "gatsby"
import SEO from "./SEO"

if (typeof window !== "undefined") {
  const AttachFastClick = require("fastclick")
  new AttachFastClick(document.body)
}

export default props => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            title
            cover
            author
            description
            keywords
            tagCover
            archiveCover
            siteUrl
            logo
            navigation
            subscribe
          }
        }
        master: authorJson(master: { eq: true }) {
          id
          bio
          avatar
          cover
          github
          twitter
          zhihu
          weibo
          facebook
          website
          location
        }
      }
    `}
    render={data => (
      <article>
        <SEO
          title={data.site.title}
          description={data.site.title}
          keywords={data.site.keywords}
        />
        <Navigation master={data.master || {}} site={data.site} {...props} />
        <section id="wrapper">
          <a
            className="hidden-close"
            href="javascript:void(0)"
            onClick={() =>
              document.documentElement.classList.toggle("menu-active")
            }
            rel="close"
            title="close"
          />
          {props.children}
          <div id="body-class" style={{ display: "none" }} />
          <Footer />
        </section>
      </article>
    )}
  />
)
