import PropTypes from 'prop-types'
import React from 'react'

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
export default function HTML (props) {
  return (
    <html lang="zh-cmn-Hans" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <script dangerouslySetInnerHTML={{
          __html: `window.ga_tid = "UA-124485594-1";
          window.ga_api = "https://margatroid.xyz/vue.min.js";`,
        }}/>
        <script src="https://cdn.jsdelivr.net/npm/cfga@1.0.3" async></script>
        <script dangerouslySetInnerHTML={{
          __html: darkModeSwitch,
        }} />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key="body"
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
      {
        process.env.GATSBY_IS_DEV &&
        <script
          src="https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/tex-mml-chtml.js"
          id="MathJax-script"
        />
      }
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
