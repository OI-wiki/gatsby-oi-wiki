import React from 'react'
import { graphql } from 'gatsby'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'
import getComponents from '../components/customed'
import MDRenderer from '../components/MDRenderer'
import { HistoryLocation } from '../types/location'
import Title from '../components/Title'
import Meta from '../components/Meta'
import Layout from '../components/Layout'

export const query = graphql`
  query DocInfo($id: String!) {
    mdx: markdownRemark(id: { eq: $id }) {
      id
      wordCount {
        words
      }
      fields {
        slug
        isIndex
      }
      excerpt
      htmlAst
      headings {
        value
      }
      frontmatter {
        author
        tags
        title
        noMeta
        noComment
        description
      }
      headings {
        depth
        id
        value
      }
      parent {
        ... on File {
          relativePath
          modifiedTime(formatString: "YYYY/MM/DD")
          birthTime(formatString: "")
          changeTime(formatString: "")
        }
      }
    }
  }
`


interface DocProps {
  data: DeepWriteable<DeepRequiredNonNull<GatsbyTypes.DocInfoQuery>>,
  location: HistoryLocation
}


const Doc: React.FC<DocProps> = (props) => {
  const { data, location } = props
  const { mdx } = data

  const title = mdx.fields.slug === '/' ? '' : mdx.frontmatter.title
  const description = mdx.frontmatter.description || mdx.excerpt
  const authors = mdx.frontmatter.author
  const tags = mdx.frontmatter.tags
  const noMeta = mdx.frontmatter.noMeta || false
  const noComment = mdx.frontmatter.noComment || false
  const noEdit = false
  const headings = mdx.headings || null
  const relativePath = mdx.parent.relativePath || ''
  const modifiedTime = mdx.parent.modifiedTime || ''
  const wordCount = mdx.wordCount.words || 0
  const datePublished = mdx.parent.birthTime || ''
  const dateModified = mdx.parent.changeTime || ''
  const isIndex = mdx.fields.isIndex
  const isWIP = wordCount === 0 || (tags?.findIndex((x: string) => x === 'WIP') >= 0)

  const components = getComponents({
    pathname: location.pathname,
    isIndex,
  })

  return (
    <Layout title={title} pathname={location.pathname} toc={headings}>
      <Title noEdit={noEdit} relativePath={relativePath}>{title}</Title>

      <MDRenderer htmlAst={mdx.htmlAst} components={components}/>

      {!noMeta && <Meta
        modifiedTime={modifiedTime}
        title={title}
        tags={tags}
        authors={authors}
        relativePath={relativePath}/>}
    </Layout>
  )
}

export default Doc
