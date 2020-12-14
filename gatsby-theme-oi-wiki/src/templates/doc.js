import { graphql } from 'gatsby'
import React from 'react'
import Doc from '../components/doc'

export default function MdxDoc ({ data, location }) {
  // console.log(data)
  return <Doc data={data} location={location} />
}

export const query = graphql`
  query($id: String!) {
    mdx: markdownRemark(id: { eq: $id }) {
      id
      wordCount {
        words
      }
      fields {
        slug
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
      toc: tocObject
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
