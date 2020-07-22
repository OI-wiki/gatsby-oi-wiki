import git from 'simple-git'
import React from 'react'
import { graphql } from 'gatsby'

const query = async function (prop) {
  //  +index.md or - / + .md
  const particalPath = prop.split('/').length() > 3 ? (prop.slice(0, -1) + '.md') : (prop + 'index.md')
  const completePath = 'docs' + particalPath
  const res = await git().log(['--', completePath])
  return res
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChangeLog = ({ pageContext, data, location }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, slug } = pageContext
  console.log(slug)
  const { edges } = data.allMdx
  // const { node { fields { slug: partPath}} } = edges[0]
  const partPath = edges[0].node.fields.slug
  const log = query(partPath)
  return (
    <div>
      <p>{log}</p>
      {log.all.slice(0, 15).map((item, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, data, message, refs, body, author_name: name, author_email: email } = item
        return (
          <div key={index + '/#'}>
            <p>{hash}</p>
            <p>{data}</p>
            <p>{message}</p>
            <p>{refs}</p>
            <p>{name}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ChangeLog

export const pageQuery = graphql`
  query($id: String){
      allMdx(filter: { id: {eq: $id } }) {
          edges {
              node {
                  fields {
                    slug
                  }
              }
          }
      }
  }
`
