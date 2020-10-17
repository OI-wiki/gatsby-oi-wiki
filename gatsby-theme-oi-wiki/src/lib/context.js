/* eslint-disable react/display-name */
import React from 'react'

const isFunction = obj => typeof obj === 'function'

const ComponentContext = React.createContext({})

export const withCustomComponents = Component => props => {
  const allComponents = useCustomComponents(props.components)
  return <Component {...props} components={allComponents} />
}

export const useCustomComponents = components => {
  const contextComponents = React.useContext(ComponentContext)
  let allComponents = contextComponents
  if (components) {
    allComponents = isFunction(components)
      ? components(contextComponents)
      : { ...contextComponents, ...components }
  }

  return allComponents
}

export const ComponentProvider = props => {
  const allComponents = useCustomComponents(props.components)

  return (
    <ComponentContext.Provider value={allComponents}>
      {props.children}
    </ComponentContext.Provider>
  )
}

export default ComponentContext
