import React from 'react'
import reactiveHast, { ReactiveHastComponents, ReactiveHastHtmlAst } from './reactiveHast'

export interface MDRendererProps {
  components: ReactiveHastComponents;
  htmlAst: ReactiveHastHtmlAst;
}

const MDRenderer: React.FC<MDRendererProps> = (props) => {
  const { components, htmlAst } = props
  return reactiveHast({
    ...htmlAst,
    tagName: 'div',
  }, components ?? {}) as ReturnType<React.FC>
}

export default React.memo(MDRenderer, () => true)
