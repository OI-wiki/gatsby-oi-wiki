import { graphql } from 'gatsby'
import React from 'react'
import Doc from '../components/doc'

export default ({ data, location }) => {
  return <Doc data={data} location={location} />
}

export const query = graphql`
  query($id: String!) {
    doc: doc(id: { eq: $id }) {
      id
      slug
      title
      description
      excerpt
      body
      headings {
        value
      }
      parent {
        ... on Mdx {
          frontmatter {
            author
            tags
          }
          toc: tableOfContents
        }
      }
    }
  }
`
