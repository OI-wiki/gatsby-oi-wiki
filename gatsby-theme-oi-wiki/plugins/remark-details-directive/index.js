import { visit } from 'unist-util-visit'

export default function attacher () {
    return function transformer (ast) {
        visit(ast, 'containerDirective', function(node) {
            if (node.name !== 'detail') return
            node.data = {
                'hName': 'details',
                'hProperties': {}
            }
            Object.entries(node.attributes).forEach(([k, v]) => {
                if (k === 'class') k = 'className'
                node.data['hProperties'][k] = v
            })
            node.children[0].data = {
                'hName': 'summary'
            }
        })
    }
}
