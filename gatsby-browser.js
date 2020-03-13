const React = require("react")

exports.onRouteUpdate = ({ location, prevLocation }) => {
  ;(function() {
    // reload mathjax
    MathJax.typeset()
  })()
}
