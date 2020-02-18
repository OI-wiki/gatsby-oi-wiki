import { graphql } from "gatsby"
import React from "react"
import Doc from "../components/doc"
import "./extra.css"

export default ({ data, location }) => {
  // console.log(data)
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
        title
      }
      toc: tableOfContents
    }
  }
`
