import './static/extra.css'
import './static/prism-theme.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

export const onRouteUpdate = () => {
  if (process.env.GATSBY_IS_DEV) {
    // eslint-disable-next-line no-undef
    requestIdleCallback(() => MathJax.typeset())
  }
  window.cfga()
}
