import('./static/extra.css')
import WrapRootElement from './src/gatsby-func/WrapRootElement'

const onRouteUpdate = () => {
  if (process.env.GATSBY_IS_DEV) {
    requestIdleCallback(() => MathJax.typeset())
  }
  try {
    window.cfga()
  } catch (e) {
    console.error(e)
  }
}

export { onRouteUpdate, WrapRootElement as wrapRootElement }
