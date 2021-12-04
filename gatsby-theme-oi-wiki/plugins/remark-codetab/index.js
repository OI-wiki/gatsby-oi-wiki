import { visit } from 'unist-util-visit'

export default function attacher () {
    return function transformer (ast) {
        visit(ast, 'containerDirective', function(node) {
            if (node.name !== 'codes') return
            
            const langs = []
            node.children = node.children.filter(i => {
                if (i.type !== 'code') {
                    console.warn('codes: ignoring non-code block')
                    return false
                }
                langs.push(i.lang)
                return true
            })

            node.data = {
                hName: 'ow-codes',
                hProperties: { 'tab-labels': langs.join(',') } 
            }
            
        })
    }
}