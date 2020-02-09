import { graphql } from "gatsby"
import React from "react"
import Doc from "../components/doc"

export default ({ data, location }) => {
  return <Doc data={data} location={location} />
}

export const query = graphql`
  query($id: String!) {
    mdx: mdx(id: { eq: $id }) {
      id
      fields {
        slug
      }
      excerpt
      body
      headings {
        value
      }
      frontmatter {
        author
        tags
      }
      toc: tableOfContents
    }
  }
`
