import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React, { useState, useEffect } from 'react'
import { findAll } from 'highlight-words-core'
import Details from './Details.tsx'
import Layout from './Layout'
import Summary from './Summary.tsx'
import Link from './Link'

function fixMathJaxCustomElement (mdxString) {
  mdxString = mdxString.replace(/"className": ?"mjx/g, '"class": "mjx')
  mdxString = mdxString.replace(/"className": ?"MathJax/g, '"class": "MathJax')
  return mdxString.replace(/"className": ?"MJX/g, '"class": "MJX')
}
function Mdx ({ data: { mdx }, location }) {
  // console.log(mdx);
  // const headingTitle = mdx.headings[0] && mdx.headings[0].value
  const title = mdx.slug === '/' ? null : mdx.frontmatter.title
  const description = mdx.frontmatter.description || mdx.excerpt
  const authors = mdx.frontmatter.author || null
  const tags = mdx.frontmatter.tags || null
  const noMeta = mdx.frontmatter.noMeta || 'false'
  const noComment = mdx.frontmatter.noComment || 'false'
  const noEdit = mdx.frontmatter.noEdit || 'false'
  const toc = mdx.toc || null
  const relativePath = mdx.parent.relativePath || ''
  const modifiedTime = mdx.parent.modifiedTime || ''
  const wordCount = mdx.wordCount.words || 0

  const [searchKey, setSearchKey] = useState('')
  useEffect(() => {
    console.log(location.state.searchKey)
    if (location.state.searchKey) {
      setSearchKey(location.state.searchKey)
      setIsHighlight(true)
      setTimeout(() => setIsHighlight(false), 5000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const MyH1 = props => {
    // console.log(highLight)
    if (!isHighlight) { return <h2 {...props} /> }
    const { children } = props
    const textToHighlight = children[0]
    const searchWords = [searchKey]

    const chunks = findAll({
      searchWords,
      textToHighlight,
    })

    const highlightedText = chunks
      .map(chunk => {
        const { end, highlight, start } = chunk
        const text = textToHighlight.substr(start, end - start)
        if (highlight) {
          return (<mark>{text}</mark>)
        } else {
          return (<span>{text}</span>)
        }
      })
      .reduce((pre, cur) => [pre, '', cur])

    return (
      <h2>{highlightedText}{children[1]}{children[2]}</h2>
    )
  }

  const myComponents = {
    details: Details,
    summary: Summary,
    a: Link(location),
    inlinecode: 'code',
    h2: MyH1,
  }
  const [isHighlight, setIsHighlight] = useState(false)
  const isWIP = wordCount === 0 || (tags?.findIndex(x => x === 'WIP') >= 0)
  return (
    <Layout
      location={location}
      authors={authors}
      title={title}
      description={description}
      tags={tags}
      toc={toc}
      relativePath={relativePath}
      modifiedTime={modifiedTime}
      noMeta={noMeta}
      noComment={noComment}
      noEdit={noEdit}
      isWIP={isWIP}
    >
      <MDXProvider components={myComponents}>
        <MDXRenderer>{fixMathJaxCustomElement(mdx.body)}</MDXRenderer>
      </MDXProvider>
    </Layout>
  )
}

export default Mdx
