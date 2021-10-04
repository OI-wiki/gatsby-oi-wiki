require('./static/extra.css');

exports.onRouteUpdate = () => {
  if (process.env.GATSBY_IS_DEV) {
    requestIdleCallback(() => MathJax.typeset());
  }
  try {
    window.cfga();
  } catch (e) {
    console.error(e);
  }
};
