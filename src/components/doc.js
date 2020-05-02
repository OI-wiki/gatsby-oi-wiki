import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import Layout from './Layout'
import { MDXProvider } from '@mdx-js/react'
import Details from './Details'
import Summary from './Summary'

function mdx ({ data: { mdx }, location }) {
  // const headingTitle = mdx.headings[0] && mdx.headings[0].value
  const title = mdx.slug === '/' ? null : mdx.frontmatter.title
  const description = mdx.frontmatter.description || mdx.excerpt
  const authors = mdx.frontmatter.author || null
  const tags = mdx.frontmatter.tags || null
  const noMeta = mdx.frontmatter.noMeta || 'false'
  const noComment = mdx.frontmatter.noComment || 'false'
  const noEdit = mdx.frontmatter.noEdit || 'false'
  const toc = mdx.toc || null
  // console.log(mdx)
  const relativePath = mdx.parent.relativePath || ''
  const modifiedTime = mdx.parent.modifiedTime || ''

  const myComponents = {
    details: Details,
    summary: Summary,
  }

  return (
    <Layout
      location={location}
      authors={authors}
      title={title}
      description={description}
      tags={tags}
      toc={toc}
      relativePath={relativePath}
      modifiedTime={modifiedTime}
      noMeta={noMeta}
      noComment={noComment}
      noEdit={noEdit}
    >
      <MDXProvider components={myComponents}>

        <MDXRenderer>{mdx.body}</MDXRenderer>
      </MDXProvider>
    </Layout>
  )
}

export default mdx
