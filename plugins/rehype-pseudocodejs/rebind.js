/* eslint-disable no-throw-literal */
/* eslint-disable @typescript-eslint/no-var-requires */

// var ParseError = require('pseudocode/src/ParseError')
const Lexer = require('pseudocode/src/Lexer')
const Parser = require('pseudocode/src/Parser')
const Renderer = require('pseudocode/src/Renderer')

function makeRenderer (data, options) {
  var lexer = new Lexer(data)
  var parser = new Parser(lexer)
  const renderer = new Renderer(parser, options)
  // while setting 'mathjax', it does nothing but surround
  // texts with '$'
  renderer.backend = {
    name: 'mathjax',
    driver: {},
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
