const toString = require(`mdast-util-to-string`)
const visit = require(`unist-util-visit`)
const slugs = require(`github-slugger`)()
const deburr = require(`lodash/deburr`)

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value
  }

  return context[key]
}

const svgIcon = `<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`

module.exports = ({
  markdownAST
}, {
  icon = svgIcon,
  className = `anchor`,
  maintainCase = false,
  removeAccents = false,
  enableCustomId = false,
  isIconAfterHeader = false,
  offsetY = 0,
}) => {
  slugs.reset()

  visit(markdownAST, `heading`, node => {
    let id
    if (enableCustomId && node.children.length > 0) {
      const last = node.children[node.children.length - 1]
      // This regex matches to preceding spaces and {#custom-id} at the end of a string.
      // Also, checks the text of node won't be empty after the removal of {#custom-id}.
      const match = /^(.*?)\s*\{#([\w-]+)\}$/.exec(toString(last))
      if (match && (match[1] || node.children.length > 1)) {
        id = match[2]
        // Remove the custom ID from the original text.
        if (match[1]) {
          last.value = match[1]
        } else {
          node.children.pop()
        }
      }
    }
    if (!id) {
      const slug = slugs.slug(toString(node), maintainCase)
      id = removeAccents ? deburr(slug) : slug
    }
    const data = patch(node, `data`, {})

    patch(data, `id`, id)
    patch(data, `htmlAttributes`, {})
    patch(data, `hProperties`, {})
    patch(data.htmlAttributes, `id`, id)
    patch(data.hProperties, `id`, id)
    patch(data.hProperties, `style`, `position:relative;`)

    if (icon !== false) {
      const label = id.split(`-`).join(` `)
      const method = isIconAfterHeader ? `push` : `unshift`
      node.children[method]({
        type: `link`,
        url: `#${id}`,
        title: null,
        children: [],
        data: {
          hProperties: {
            "aria-label": `${label} permalink`,
            class: `${className} ${isIconAfterHeader ? `after` : `before`}`,
          },
          hChildren: [{
            type: `raw`,
            // The Octicon link icon is the default. But users can set their own icon via the "icon" option.
            value: icon,
          }, ],
        },
      })
    }
  })

  const styles = `
  <style type="text/css">
    .${className}.before {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      padding-right: 4px;
    }
    .${className}.after {
      display: inline-block;
      padding-left: 4px;
    }
    h1 .${className} svg,
    h2 .${className} svg,
    h3 .${className} svg,
    h4 .${className} svg,
    h5 .${className} svg,
    h6 .${className} svg {
      visibility: hidden;
    }
    h1:hover .${className} svg,
    h2:hover .${className} svg,
    h3:hover .${className} svg,
    h4:hover .${className} svg,
    h5:hover .${className} svg,
    h6:hover .${className} svg,
    h1 .${className}:focus svg,
    h2 .${className}:focus svg,
    h3 .${className}:focus svg,
    h4 .${className}:focus svg,
    h5 .${className}:focus svg,
    h6 .${className}:focus svg {
      visibility: visible;
    }
</style>
  `

  // This script used to have `let scrollTop` and `let clientTop` instead of
  // current ones which are `var`. It is changed due to incompatibility with
  // older browsers (that do not implement `let`). See:
  //  - https://github.com/gatsbyjs/gatsby/issues/21058
  //  - https://github.com/gatsbyjs/gatsby/pull/21083
  const script = `
  <script>
    document.addEventListener("DOMContentLoaded", function(event) {
      var hash = window.decodeURI(location.hash.replace('#', ''))
      if (hash !== '') {
        var element = document.getElementById(hash)
        if (element) {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
          var clientTop = document.documentElement.clientTop || document.body.clientTop || 0
          var offset = element.getBoundingClientRect().top + scrollTop - clientTop
          // Wait for the browser to finish rendering before scrolling.
          setTimeout((function() {
            window.scrollTo(0, offset - ${offsetY})
          }), 0)
        }
      }
    })
    </script>
    `
  
  /**
  markdownAST.children.push({
    type: 'html',
    value: styles + script
  });
  */

  return markdownAST
}
