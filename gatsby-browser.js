const React = require("react")

exports.onRouteUpdate = ({ location, prevLocation }) => {
  ;(function() {
    // reload mathjax
    console.log(MathJax)
    MathJax.typeset()
  })()
}
