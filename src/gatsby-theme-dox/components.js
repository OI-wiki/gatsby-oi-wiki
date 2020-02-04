import Prism from '@theme-ui/prism'
import Link from './components/Link'
import Details from './components/Details'
import Summary from './components/Summary'

export default {
  a: Link,
  code: Prism,
  pre: props => props.children,
  details: Details,
  summary: Summary
}
