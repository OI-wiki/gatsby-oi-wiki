import { PreRenderHTMLArgs } from 'gatsby'
import React from 'react'

const onPreRenderHTML = (args: PreRenderHTMLArgs): void => {
  if (process.env.GATSBY_IS_DEV) {
    const {
      getPostBodyComponents,
      replacePostBodyComponents,
    } = args
    const comps = getPostBodyComponents()

    comps.push(
      <script
        src="https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/tex-mml-chtml.js"
        id="MathJax-script"
      />,
    )

    replacePostBodyComponents(comps)
  }
}

export default onPreRenderHTML
