export const onRouteUpdate = ({ location, prevLocation }) => {
  ;(function() {
    // reload mathjax
    MathJax.typeset()
  })()
}
