const React = require("react")

exports.onRouteUpdate = ({ location, prevLocation }) => {
  //console.log("old pathname", prevLocation ? prevLocation.pathname : null);
  //console.log("new pathname", location.pathname);
  (function() {
    //reload mathjax
    window.MathJax.Hub.Typeset()
  })()
}
