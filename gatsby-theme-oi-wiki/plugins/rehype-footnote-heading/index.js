const visit = require('unist-util-visit')

module.exports = function () {
  return function (ast) {
    visit(ast, 'element', function (node, index, parent) {
      if (node.tagName !== 'h2') return
      if (node.properties['id'] !== 'footnote-label') return
      const properties = node.properties
      for (const i of Object.keys(node)) {
        delete node[i]
      }
      node.type = 'element'
      node.tagName = 'hr'
      node.properties = properties
      node.properties['className'].push('MuiDivider-root', 'makeStyles-divider-4')
    })
  }
}
