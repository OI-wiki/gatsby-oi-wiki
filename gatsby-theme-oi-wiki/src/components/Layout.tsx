import Grid from '@mui/material/Grid'
import Header, { HeaderProps } from './Header'
import NavSidebar from './NavSidebar'
import Main from './Main'
import TocSidebar, { TocSidebarProps } from './TocSidebar'
import React from 'react'
import styled from '@mui/material/styles/styled'
import { NavSidebarProps } from './NavSidebar/types'
import { observer } from 'mobx-react-lite'

const MainContentDiv = styled(Grid)`
  flex-grow: 1;
  flex-flow: row;
`

export interface LayoutProps extends HeaderProps, Partial<NavSidebarProps>, Partial<TocSidebarProps> {
  withNav?: boolean;
  withToc?: boolean;
}


const Layout: React.FC<LayoutProps> = observer((props) => {
  const { title, withNav = true, withToc = true, pathname = '', toc = [], children } = props

  return (
    <Grid container={true} direction="column" minHeight="100vh">
      <Header title={title}/>

      <MainContentDiv className="maincontentdiv" container={true} item={true}>
        {withNav && <NavSidebar pathname={pathname}/>}

        <Main item={true} withNav={withNav} withToc={withToc}>
          {children}
        </Main>

        {withToc && <TocSidebar toc={toc}/>}
      </MainContentDiv>

    </Grid>
  )
})

export default Layout
