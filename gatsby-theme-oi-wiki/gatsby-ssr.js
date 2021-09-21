import WrapRootElement from './src/gatsby-func/WrapRootElement'
import onRenderBody from './src/gatsby-func/onRenderBody'
import onPreRenderHTML from './src/gatsby-func/onPreRenderHTML'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(true)

export { onPreRenderHTML, onRenderBody, WrapRootElement as wrapRootElement }
