const visit = require('unist-util-visit')

function transformCodeBlock() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (typeof node.properties.dataLanguage !== 'undefined') {
        node.tagName = 'codeblock'
      }
    })
  }
}

module.exports = transformCodeBlock
