import React from 'react'
import { LanguageProvider } from './src/languageContext.js'
export const wrapRootElement = ({ element }) => {
  return (
    <LanguageProvider>
      {element}
    </LanguageProvider>
  )
}
