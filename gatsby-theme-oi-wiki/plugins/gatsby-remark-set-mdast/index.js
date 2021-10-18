/**
 * @file utility plugin to insert json mdast into document
 * this plugin is a part of a temporary solution
 * and shall not be used manually in any means 
 */

const visit = require('unist-util-visit')
const { SKIP } = require('unist-util-visit-parents')

module.exports = function ({ markdownAST }) {
    visit(markdownAST, 'code', function(node, index, parent) {
        if(node.lang === '__internal_dangerously_set_mdast') {
            parent.children[index] = JSON.parse(node.value)
        }
        return SKIP
    })
}