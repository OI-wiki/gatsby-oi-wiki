import './static/extra.css'
import './static/prism-theme.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import React from 'react'
import { LanguageProvider } from './src/languageContext.js'
export const onRouteUpdate = () => {
  if (process.env.GATSBY_IS_DEV) {
    // eslint-disable-next-line no-undef
    requestIdleCallback(() => MathJax.typeset())
  }
  window.cfga()
}
export const wrapRootElement = ({ element }) => {
  return (
    <LanguageProvider>
      {element}
    </LanguageProvider>
  )
}
