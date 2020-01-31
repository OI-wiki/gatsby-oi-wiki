import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/SEO'

function Doc({ data: { doc }, location }) {
  const headingTitle = doc.headings[0] && doc.headings[0].value
  const title = doc.slug === '/' ? null : doc.title || headingTitle
  const description = doc.description || doc.excerpt

  return (
    <Layout location={location} doc={doc}>
      <SEO title={title} description={description} />
      <MDXRenderer>{doc.body}</MDXRenderer>
    </Layout>
  )
}

export default Doc
