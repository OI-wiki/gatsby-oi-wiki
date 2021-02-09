import reactiveHast from './reactive-hast'
import React from 'react'

function MDRenderer ({ components, htmlAst }) {
  return reactiveHast({ ...htmlAst, tagName: 'div' }, components ?? {})
}

export default React.memo(MDRenderer, () => true)
