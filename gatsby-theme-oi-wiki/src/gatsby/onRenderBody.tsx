import React from 'react'
import { VARS_STORE_ID } from '../stores/cssVarsStore'
import { theme } from '../theme'
import createCssVarPalette, { computeCss } from '../utils/createCssVarPalette'
import { RenderBodyArgs } from 'gatsby'
import cssVars from '../static/cssVars'
import themeMode from '../static/themeMode'

const { lightMap, darkMap } = createCssVarPalette(theme.palette)

const defaultCssVars = computeCss(lightMap, darkMap).styles.replace(/\s/g, '')

const headComponents: React.ReactNode[] = [
  <meta key="color-scheme" name="color-scheme" content="light dark"/>,
  <script key="theme-switch" dangerouslySetInnerHTML={{
    __html: `(${themeMode})()`,
  }}/>,
  <style key={VARS_STORE_ID} id={VARS_STORE_ID} dangerouslySetInnerHTML={{
    __html: defaultCssVars,
  }}/>,
  <script key={VARS_STORE_ID + '-restore'} dangerouslySetInnerHTML={{
    __html: `(${cssVars})()`,
  }}/>,
  <script key="analytics" dangerouslySetInnerHTML={{
    __html: `window.ga_tid = "UA-124485594-1"; window.ga_api = "https://margatroid.xyz/vue.min.js";`,
  }}/>,
  <script key="cfga" src="https://cdn.jsdelivr.net/npm/cfga@1.0.3" async/>,
]

const htmlAttributes = {
  lang: 'zh-cmn-Hans',
}

const onRenderBody = (props: RenderBodyArgs): void => {
  const { setHeadComponents, setHtmlAttributes } = props

  setHeadComponents(headComponents)
  setHtmlAttributes(htmlAttributes)
}

export default onRenderBody
