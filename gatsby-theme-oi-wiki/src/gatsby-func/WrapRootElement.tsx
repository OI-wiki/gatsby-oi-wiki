import React, { useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { WrapRootElementBrowserArgs } from 'gatsby'
import { theme } from '../theme'
import { cssVarsStore, VARS_STORE_ID } from '../stores/cssVarsStore'
import { observer } from 'mobx-react-lite'
import { autorun } from 'mobx'
import { GlobalStyles } from '@mui/material'
import globalStyle from '../theme/globalStyle'

const StoreHandler: React.FC = observer(() => {

  autorun(() => {
    if (cssVarsStore.styleEl === null && typeof window !== 'undefined') {
      cssVarsStore.setStyleEl(document.getElementById(VARS_STORE_ID))
    }

    if (cssVarsStore.styleEl !== null) {
      cssVarsStore.styleEl.innerHTML = cssVarsStore.computedCss.styles
    }
  })

  useEffect(() => {
    return () => {
      cssVarsStore.stopStore()
    }
  }, [])

  return <></>
})

const WrapRootElement = ({ element }: WrapRootElementBrowserArgs): JSX.Element => {
  return (
    <React.StrictMode>
      <StoreHandler/>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <GlobalStyles styles={globalStyle(theme)}/>
        {element}
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default WrapRootElement
