import Prism from '@theme-ui/prism'
import Link from './components/Link'
import Img from './components/Img'

export default {
  a: Link,
  code: Prism,
  pre: props => props.children
}
