import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React, { useEffect } from 'react'
import Mark from 'mark.js'
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

  const highlightNode = (tagName, isHighlight) => {
    const mainNodes = document.getElementsByTagName('main')
    const nodes = mainNodes[0].getElementsByTagName(tagName)
    const children = [...nodes]
    if (isHighlight) {
      children.forEach((node) => {
        const instance = new Mark(node)
        instance.mark(location.state.searchKey)
      })
    } else {
      children.forEach((node) => {
        const instance = new Mark(node)
        instance.unmark(location.state.searchKey)
      })
    }
  }
  useEffect(() => {
    if (location.state.searchKey) {
      highlightNode('h2', true)
      highlightNode('p', true)
      setTimeout(
        () => {
          highlightNode('h2', false)
          highlightNode('p', false)
        }, 5000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const myComponents = {
    details: Details,
    summary: Summary,
    a: Link(location),
    inlinecode: 'code',
    // h2: MyH2,
  }

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
