/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-var-requires */

// Pseudo Code! Re:Bind

const Lexer = require('pseudocode/src/Lexer')
const Parser = require('pseudocode/src/Parser')
const Renderer = require('pseudocode/src/Renderer')

function makeRenderer (data, options) {
  var lexer = new Lexer(data)
  var parser = new Parser(lexer)
  const renderer = new Renderer(parser, options)

  // override driver to post-process by rehype-mathjax
  renderer.backend = {
    name: 'katex',
    driver: {
      renderToString (math) {
        return `<span class="math math-inline">${math}</span>`
      },
    },
  }

  return renderer
}

module.exports = {
  renderToString: function (input, options) {
    if (input === null || input === undefined) { throw 'input cannot be empty' }

    var renderer = makeRenderer(input, options)
    return renderer.toMarkup()
  },
}
