/* eslint-disable @typescript-eslint/no-var-requires */

const React = require('react')

const darkModeSwitch = `window.onthemechange = function (settings) {
  const fallback = localStorage.settings &&
    JSON.parse(localStorage.settings).darkMode.type
  const darkOpt = settings !== undefined ? settings.darkMode.type : fallback
  let themeClass = 'themeAuto'
  if (darkOpt === undefined || darkOpt === 'user-preference') {
    // themeClass = 'themeAuto'
  } else {
    themeClass = darkOpt === 'always-on' ? 'themeDark' : 'themeLight'
  }
  const docEl = document.querySelector('html')
  docEl.classList.remove('themeLight', 'themeDark', 'themeAuto')
  docEl.classList.add(themeClass)
}

window.onthemechange()`

const HtmlAttributes = {
  lang: 'zh-cmn-Hans',
}

const HeadComponents = [
  <meta key="charset" charSet="utf-8" />,
  <meta key="ua" httpEquiv="x-ua-compatible" content="ie=edge" />,
  <meta key="viewport" name="viewport"
    content="width=device-width, initial-scale=1, shrink-to-fit=no"
  />,
  <script key="analytics" dangerouslySetInnerHTML={{
    __html: `window.ga_tid = "UA-124485594-1";
    window.ga_api = "https://margatroid.xyz/vue.min.js";`,
  }} />,
  <script key="cfga" src="https://cdn.jsdelivr.net/npm/cfga@1.0.3" async></script>,
  <script key="theme" dangerouslySetInnerHTML={{
    __html: darkModeSwitch,
  }} />,
]

exports.onPreRenderHTML = ({
  getPostBodyComponents,
  replacePostBodyComponents,
}) => {
  const comps = getPostBodyComponents()
  process.env.GATSBY_IS_DEV && comps.push(
    <script
      src="https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/tex-mml-chtml.js"
      id="MathJax-script"
    />,
  )
  replacePostBodyComponents(comps)
}

exports.onRenderBody = ({
  setHeadComponents,
  setHtmlAttributes,
}) => {
  setHtmlAttributes(HtmlAttributes)
  setHeadComponents(HeadComponents)
}
