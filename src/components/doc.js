import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import Layout from "../components/Layout"

function mdx({ data: { mdx }, location }) {
  const headingTitle = mdx.headings[0] && mdx.headings[0].value
  const title = mdx.slug === "/" ? null : mdx.frontmatter.title;
  const description = mdx.description || mdx.excerpt
  const authors = mdx.frontmatter.author || null
  const tags = mdx.frontmatter.tags || null
  const toc = mdx.toc || null

  return (
    <Layout
      location={location}
      authors={authors}
      title={title}
      description={description}
      tags={tags}
      toc={toc}
    >
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </Layout>
  )
}

export default mdx
