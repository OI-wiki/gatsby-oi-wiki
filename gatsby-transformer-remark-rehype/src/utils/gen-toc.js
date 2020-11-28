
const unified = require('unified')

const toString = require('mdast-util-to-string')
const map = require('unist-util-map')
const slugs = require('github-slugger')()
const _ = require('lodash')
// const deburr = require('lodash/deburr')

const isheading = /^h[1-6]$/
function toc(ast) {  
  
  slugs.reset()

  function visit(node) {
    if(node.type !== 'element') return undefined
    
    const level = isheading.exec(node.tagName)
    if (level) {
      const str = toString(node)
      const slug = slugs.slug(str, false)
      let items = []
      // todo
      if (node.children) items = node.children.flatMap(e => visit(e)).filter(e => e !== undefined)
      const o = {
        url: `#${slug}`,
        title: str,
        items: items
      }
      return o
    } else {
      // todo
    }
  }

  return { items: ast.children.map(e => visit(e)) }
}

module.exports = function genToc(hast) {
  return toc(hast)
}