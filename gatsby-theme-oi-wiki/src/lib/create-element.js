import React from 'react'

import { useCustomComponents } from './context'

const TYPE_PROP_NAME = 'mdxType'

const DEFAULTS = {
  inlineCode: 'code',
  // eslint-disable-next-line react/display-name
  wrapper: ({ children }) => React.createElement(React.Fragment, {}, children),
}

const ChildrenCreateElement = React.forwardRef((props, ref) => {
  const {
    components: propComponents,
    mdxType,
    originalType,
    parentName,
    ...etc
  } = props

  const components = useCustomComponents(propComponents)
  const type = mdxType
  const Component =
    components[`${parentName}.${type}`] ||
    components[type] ||
    DEFAULTS[type] ||
    originalType

  if (propComponents) {
    return React.createElement(Component, {
      ref,
      ...etc,
      components: propComponents,
    })
  }

  return React.createElement(Component, { ref, ...etc })
})

ChildrenCreateElement.displayName = 'ComponentCreateElement'

export default function (type, props) {
  const args = arguments
  const mdxType = props && props.mdxType

  if (typeof type === 'string' || mdxType) {
    const argsLength = args.length

    const createElementArgArray = new Array(argsLength)
    createElementArgArray[0] = ChildrenCreateElement

    const newProps = {}
    for (const key in props) {
      if (hasOwnProperty.call(props, key)) {
        newProps[key] = props[key]
      }
    }

    newProps.originalType = type
    newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType

    createElementArgArray[1] = newProps

    for (let i = 2; i < argsLength; i++) {
      createElementArgArray[i] = args[i]
    }

    return React.createElement.apply(null, createElementArgArray)
  }

  return React.createElement.apply(null, args)
}
