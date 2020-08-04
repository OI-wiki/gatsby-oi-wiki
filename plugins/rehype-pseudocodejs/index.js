/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const visit = require('unist-util-visit')
const nodeToString = require('hast-util-to-string')
const unified = require('unified')
const parse = require('rehype-parse')
const pseudo = require('./rebind')
// const refractor = require('refractor')

module.exports = (options) => {
  options = options || {}

  let finish = false
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
        // .use(options.mathProcessor)
        .parse(markup)

      node.children = dom.children
      node.properties = {}
      node.tagName = 'div'

      // if (node.tagName === 'head') {
      if (!finish) {
        node.children.push({
          type: 'element',
          tagName: 'link',
          properties: {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css',
          },
        })
        finish = true
      }
    } catch (e) {
      console.log(e)
    }
  }
}
