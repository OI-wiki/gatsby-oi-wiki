import './static/extra.css'

export const onRouteUpdate = ({ location, prevLocation }) => {
  ;(function () {
    // reload mathjax
    MathJax.typeset()
  })()
}
