
const unified = require('unified')

const toString = require('mdast-util-to-string')
const visit = require('unist-util-visit')
const slugs = require('github-slugger')()
const _ = require('lodash')
// const deburr = require('lodash/deburr')

const isheading = /^h[1-6]$/
function toc(ast) {  
  
  slugs.reset()
  const items = []
  visit(ast, 'element', visitor)

  function visitor(node) {
    const level = isheading.exec(node.tagName)
    if (level) {
      const str = toString(node)
      const slug = slugs.slug(str, false)
      
      items.push({
        url: `#${slug}`,
        title: str,
        level: parseInt(level[0].substring(1)),
      })
    }
  }

  return { items }
}

module.exports = function genToc(hast) {
  return toc(hast)
}