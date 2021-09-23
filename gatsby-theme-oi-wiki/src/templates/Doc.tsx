import React from 'react'
import { graphql } from 'gatsby'
import { DeepRequiredNonNull } from '../types/common'
import unified from 'unified'
import rehypeReact, { Options } from 'rehype-react'
import { Root } from 'hast'
import Grid from '@mui/material/Grid'
import Header from '../components/Header'
import Main from '../components/Main'
import NavSidebar from '../components/NavSidebar'

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
  data: DeepRequiredNonNull<GatsbyTypes.DocInfoQuery>,
  location: Location
}


const processor = unified()
  .use(rehypeReact, {
    createElement: React.createElement,
  } as Options<typeof React.createElement>)

const contentParser = (htmlAst: Root): JSX.Element =>
  (processor.stringify(htmlAst) as never as JSX.Element)


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

        <Grid container={true} item={true} flexGrow={1} sx={{ flexFlow: 'row' }}>
          <NavSidebar pathname={location.pathname}/>

          <Main item={true}>
            <article>
              {contentParser(mdx.htmlAst)}
            </article>
          </Main>

        </Grid>

      </Grid>
    </>
  )
}

export default Doc
