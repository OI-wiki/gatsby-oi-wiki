/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const visit = require('unist-util-visit')
const nodeToString = require('hast-util-to-string')
const unified = require('unified')
const parse = require('rehype-parse')
const pseudo = require('./pcr')

module.exports = () => {
  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor (node) {
    const className = node.properties.className || []
    if (!className.includes('gatsby-highlight') || node.properties.dataLanguage !== 'pseudo') {
      return
    }

    try {
      const markup = pseudo.renderToString(nodeToString(node))
      const dom = unified()
        .use(parse, { fragment: true })
        .parse(markup)

      node.children = dom.children
      node.properties = {}
      node.tagName = 'div'
    } catch (e) {
      console.log(e)
    }
  }
}
