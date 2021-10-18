import React from 'react'
import { unified } from 'unified'
import rehypeReact from 'rehype-react'
import { Root } from 'hast'

export interface MDRendererProps {
  components: Record<string, any>;
  htmlAst: Root;
}

const MDRenderer: React.FC<MDRendererProps> = (props) => {
  const processor = unified().use(rehypeReact, {
    createElement: React.createElement,
    components: props.components,
  })

  return processor.stringify(props.htmlAst) as never as JSX.Element
}

export default React.memo(MDRenderer, () => true)
