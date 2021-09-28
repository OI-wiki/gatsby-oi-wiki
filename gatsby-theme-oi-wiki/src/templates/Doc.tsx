import React from 'react'
import { graphql } from 'gatsby'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'
import Grid from '@mui/material/Grid'
import Header from '../components/Header'
import Main from '../components/Main'
import TocSidebar from '../components/TocSidebar'
import NavSidebar from '../components/NavSidebar'
import styled from '@mui/material/styles/styled'
import getComponents from '../components/customed'
import MDRenderer from '../components/MDRenderer'
import { HistoryLocation } from '../types/location'
import Title from '../components/Title'
import Meta from '../components/Meta'

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

const MainContentDiv = styled(Grid)`
  flex-grow: 1;
  flex-flow: row;
`

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
    <>
      <Grid container={true} direction="column" minHeight="100vh">
        <Header title={title}/>

        <MainContentDiv className="maincontentdiv" container={true} item={true}>
          <NavSidebar pathname={location.pathname}/>

          <Main item={true}>
            <Title title={title} noEdit={noEdit} relativePath={relativePath}/>
            <MDRenderer htmlAst={mdx.htmlAst} components={components}/>
            {!noMeta && <Meta
              modifiedTime={modifiedTime}
              title={title}
              tags={tags}
              authors={authors}
              relativePath={relativePath}/>}
          </Main>

          <TocSidebar toc={headings}/>
        </MainContentDiv>

      </Grid>
    </>
  )
}

export default Doc
