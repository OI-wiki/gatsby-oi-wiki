const visit = require('unist-util-visit')

module.exports = function () {
  return function (ast) {
    visit(ast, 'element', function (node, index, parent) {
      if (node.tagName !== 'h2') return
      if (node.properties['id'] !== 'footnote-label') return

      parent[index] = {
        type: 'element',
        tagName: 'hr',
        properties: node.properties
      }
    })
  }
}