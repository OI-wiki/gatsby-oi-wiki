/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const visit = require('unist-util-visit')
const pseudo = require('./pcr')

module.exports = () => {
  return (tree) => {
    visit(tree, 'code', visitor)
  }

  function visitor (node) {
    
    if (node.lang !== 'pseudo') return

    try {
      const markup = pseudo.renderToString(node.value)
      
      delete node.lang
      delete node.meta
      node.type = 'html'
      node.value = markup

    } catch (e) {
      console.log(e)
    }
  }
}
