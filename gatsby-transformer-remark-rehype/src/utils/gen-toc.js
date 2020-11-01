
const unified = require('unified')
const remark = require('remark-parse')
const squeeze = require('remark-squeeze-paragraphs')
const getToc = require('./get-table-of-content')
const mdastToToc = require(`mdast-util-toc`)

module.exports = function genToc(markdownNode) {
    const compiler = unified().use(remark).use(squeeze)
    const mdast = compiler.parse(markdownNode.internal.content)
    const toc = mdastToToc(mdast, { maxDepth: 6 })

    return getToc(toc.map, {})
}