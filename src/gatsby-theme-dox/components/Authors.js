/** @jsx jsx */
import { graphql, useStaticQuery } from 'gatsby'
import { jsx } from 'theme-ui'

function Authors(){
  const data = useStaticQuery(graphql`
    query MyQuery {
      mdx {
        fileAbsolutePath
        frontmatter {
          author
        }
      }
    }
  `)
  console.log(data);
  return ( <h1> {data.mdx.frontmatter.author} </h1> )
}

export default Authors
