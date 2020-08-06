import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import React, { useState } from 'react'
import { LanguagesContext, languages } from '../languageContext'
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

  const myComponents = {
    details: Details,
    summary: Summary,
    a: Link(location),
    inlinecode: 'code',
  }

  const isWIP = wordCount === 0 || (tags?.findIndex(x => x === 'WIP') >= 0)
  const [locale, setLocale] = useState(languages.zh)
  const props = { locale, setLocale }
  return (
    <LanguagesContext.Provider value={props}>
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
    </LanguagesContext.Provider>
  )
}

export default Mdx
