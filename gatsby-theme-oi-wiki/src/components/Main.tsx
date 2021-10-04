import styled from '@mui/material/styles/styled'
import Box from '@mui/material/Box'
import React from 'react'
import Grid, { GridProps } from '@mui/material/Grid'
import Footer from './Footer'
import { observer } from 'mobx-react-lite'
import { navSidebarStore, tocSidebarStore } from '../stores/sidebarStore'
import { LayoutProps } from './Layout'

const Container = styled(Grid)`
  flex-grow: 1;
  flex-flow: column;
  position: relative;
  margin: 0;
  transition: margin 225ms ease-in-out;
`

const Content = styled(Box)`
  flex-flow: row;
  flex-grow: 1;
  margin: auto;
  width: 100%;
  padding: 0 50px 120px;
  transition: padding 225ms ease-in-out;

  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;

  &[data-expanded] {
    padding-inline: 120px;
  }
`

interface MainProps extends GridProps, Pick<LayoutProps, 'withNav' | 'withToc'> {
}

const Main: React.FC<MainProps> = observer((props) => {
  const { children, withNav = true, withToc = true, ...others } = props

  const ml = (!withNav || navSidebarStore.collapsed ? 0 : navSidebarStore.width) + 'px'
  const mr = (!withToc || tocSidebarStore.collapsed ? 0 : tocSidebarStore.width) + 'px'
  const expanded = !withNav || !withToc || navSidebarStore.collapsed || tocSidebarStore.collapsed ? true : undefined

  return (
    <Container container={true} sx={{ ml, mr }} {...others}>
      <Content as='article' data-expanded={expanded}>{children}</Content>
      <Footer/>
    </Container>
  )
})

export default Main

