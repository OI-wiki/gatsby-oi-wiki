import MDRenderer from '../lib/MDRenderer'
import React, { useEffect } from 'react'
import Mark from 'mark.js'
import Details from './Details.tsx'
import Layout from './Layout'
import Summary from './Summary.tsx'
import { SmartLink } from './Link'
import SEO from './Seo'
import clsx from 'clsx'

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
  const headings = mdx.headings || null
  const relativePath = mdx.parent.relativePath || ''
  const modifiedTime = mdx.parent.modifiedTime || ''
  const wordCount = mdx.wordCount.words || 0
  const datePublished = mdx.parent.birthTime || ''
  const dateModified = mdx.parent.changeTime || ''
  const isIndex = mdx.fields.isIndex

  const highlightNode = (tagName, isHighlight) => {
    const mainNodes = document.getElementsByTagName('main')
    const nodes = mainNodes[0].getElementsByTagName(tagName)
    const children = [...nodes]
    if (isHighlight) {
      children.forEach((node) => {
        const instance = new Mark(node)
        instance.mark(
          location.state.searchKey,
          {
            exclude: ['span'],
          })
      })
    } else {
      children.forEach((node) => {
        const instance = new Mark(node)
        instance.unmark(
          location.state.searchKey,
          {
            exclude: ['span'],
          })
      })
    }
  }
  useEffect(() => {
    if (location?.state?.searchKey) {
      highlightNode('h1', true)
      highlightNode('h2', true)
      highlightNode('h3', true)
      highlightNode('p', true)
      setTimeout(
        () => {
          highlightNode('h1', false)
          highlightNode('h2', false)
          highlightNode('h3', false)
          highlightNode('p', false)
        }, 5000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function LinkGetter () {
    return function TooltipLink (props) {
      return <SmartLink {...props} pathname={location.pathname} isIndex={isIndex} tooltip />
    }
  }

  function InlineCode ({ className, children, ...props }) {
    return (
      <code {...props} className={clsx(className, 'inline-code')}>{children}</code>
    )
  }

  const myComponents = {
    details: Details,
    summary: Summary,
    a: LinkGetter(),
    inlineCode: InlineCode,
    inlinecode: InlineCode,
  }

  const isWIP = wordCount === 0 || (tags?.findIndex(x => x === 'WIP') >= 0)
  return (
    <Layout
      location={location}
      authors={authors}
      title={title}
      description={description}
      tags={tags}
      headings={headings}
      relativePath={relativePath}
      modifiedTime={modifiedTime}
      noMeta={noMeta}
      noComment={noComment}
      noEdit={noEdit}
      isWIP={isWIP}
    >
      <SEO
        title={title}
        description={description}
        author={authors || 'OI Wiki'}
        tags={tags}
        dateModified={dateModified}
        datePublished={datePublished}
        article />
      <MDRenderer components={myComponents} htmlAst={mdx.htmlAst} />
    </Layout>
  )
}

export default Mdx
