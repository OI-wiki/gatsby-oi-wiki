import WrapRootElement from './src/gatsby/WrapRootElement'
import onRenderBody from './src/gatsby/onRenderBody'
import onPreRenderHTML from './src/gatsby/onPreRenderHTML'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(true)

export { onPreRenderHTML, onRenderBody, WrapRootElement as wrapRootElement }
