import reactiveHast from './reactive-hast'
import React from 'react'
function MDRenderer ({ components, htmlAst }) {
  const comps = components ?? {}
  return reactiveHast({ ...htmlAst, tagName: 'div' }, comps)
}

export default React.memo(MDRenderer, () => true)
