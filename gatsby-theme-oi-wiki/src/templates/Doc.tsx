import React from 'react'
import { graphql } from 'gatsby'
import { DeepRequiredNonNull, DeepWriteable } from '../types/common'
import unified from 'unified'
import rehypeReact, { Options } from 'rehype-react'
import { Root } from 'hast'
import Grid from '@mui/material/Grid'
import Header from '../components/Header'
import Main from '../components/Main'
import TocSidebar from '../components/TocSidebar'
import Img from '../components/stand-in/Img'
import NavSidebar from '../components/NavSidebar'
import styled from '@mui/material/styles/styled'
import Pre from '../components/stand-in/Pre'
import Code from '../components/stand-in/Code'
import Table from '../components/stand-in/Table'

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
  location: Location
}


const processor = unified()
  .use(rehypeReact, {
    createElement: React.createElement,
    Fragment: React.Fragment,
    components: {
      img: Img,
      pre: Pre,
      code: Code,
      ...Table,
    },
  } as Options<typeof React.createElement>)

const contentParser = (htmlAst: Root): JSX.Element =>
  (processor.stringify(htmlAst) as never as JSX.Element)

const MainContentDiv = styled(Grid)`
  flex-grow: 1;
  flex-flow: row;
`

const Doc: React.FC<DocProps> = (props) => {
  const { data, location } = props
  const { mdx } = data

  const title = mdx.fields.slug === '/' ? '' : mdx.frontmatter.title
  const description = mdx.frontmatter.description || mdx.excerpt
  const authors = mdx.frontmatter.author || ''
  const tags = mdx.frontmatter.tags || []
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


  return (
    <>
      <Grid container={true} direction="column">
        <Header title={title}/>

        <MainContentDiv className="maincontentdiv" container={true} item={true}>
          <NavSidebar pathname={location.pathname}/>

          <Main item={true}>
            {contentParser(mdx.htmlAst)}
          </Main>

          <TocSidebar toc={headings}/>
        </MainContentDiv>

      </Grid>
    </>
  )
}

export default Doc
