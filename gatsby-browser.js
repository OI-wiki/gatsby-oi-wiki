const React = require("react")

export const onRouteUpdate = ({ location, prevLocation }) => {
  ;(function() {
    // reload mathjax
    MathJax.typeset()
  })()
}

export const onClientEntry = () => {
  if (process.env.NODE_ENV !== 'production') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    console.log('tracking react')
    whyDidYouRender(React, {
      trackAllPureComponents: true
    })
  }
}
