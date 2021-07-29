'use strict'

const visit = require('unist-util-visit')

const SNIPPET_TOKEN = "--8<-- "

function resolvePath (snip) {
    let str = snip.substring(SNIPPET_TOKEN.length)
    if((str.startsWith('"') && str.endsWith('"')) || 
       (str.startsWith("'") && str.endsWith("'"))) {
        str = str.substring(1, str.length - 1)
    }
    return str.replace(/^docs\//, "")
}

module.exports = async ({ markdownAST, files, reporter, loadNodeContent }, pluginOptions) => {
    let task
    visit(markdownAST, "code", (node) => {
        const contents = node.value.split("\n")
        const tasks = []
        for (const i in contents) {
            const val = contents[i].trim()
            if (val.startsWith(SNIPPET_TOKEN)) {
                const path = resolvePath(val)
                const v = files.filter(e => e.relativePath == path)[0]
                if (v == undefined) {
                    reporter.warn(`snippet: no such file ${path} to include`)
                    continue
                }

                tasks.push(new Promise(resolve => {
                    loadNodeContent(v).then(r => {
                        resolve([i, r])
                    })
                }))
            }
        }
        task = new Promise(resolve => {
            Promise.all(tasks).then(o => {
                o.forEach(e => contents[e[0]] = e[1])
                node.value = contents.join("\n")
                resolve()
            })
        })
    })

    await task

    visit(markdownAST, "paragraph", (node) => {
        if (node?.children?.[0]?.value?.trim().startsWith(SNIPPET_TOKEN)) {
            const path = resolvePath(node?.children?.[0]?.value?.trim())
            const v = files.filter(e => e.relativePath == path)[0]
            if (v == undefined) {
                reporter.warn(`snippet: no such file ${path} to include`)
            }

            // todo
        }
    })
    
    return markdownAST
}
