import styled from '@mui/material/styles/styled'
import Box from '@mui/material/Box'
import React from 'react'
import Grid, { GridProps } from '@mui/material/Grid'
import Footer from './Footer'
import { navSidebarStore } from '../stores/sidebarStore'

const Content = styled(Box)`
  flex-flow: row;
  flex-grow: 1;
  margin: auto;
  padding: 0 50px 120px;
  width: 100%;
`

const Main: React.FC<GridProps> = (props) => {
  const { children, ...others } = props
  const width = `calc(100vw - ${navSidebarStore.width}px)`

  return (
    <Grid
      container={true}
      flexGrow={1}
      flexDirection="column"
      position="relative"
      {...others}>
      <Content sx={{ width }}>
        {children}
      </Content>

      <Footer/>
    </Grid>
  )
}

export default Main

