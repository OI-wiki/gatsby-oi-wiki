import React, { useState } from 'react'
import Slide from '@mui/material/Slide'
import styled from '@emotion/styled'
import { AppBar, Button, IconButton, Tooltip } from '@mui/material'
import { HEADER_HEIGHT, headerStore } from '../../stores/headerStore'
import useSiteMetadata from '../../hooks/useSiteMetadata'
import Grid from '@mui/material/Grid'
import { Link } from 'gatsby'
import { observer } from 'mobx-react-lite'
import { useScroll } from '@use-gesture/react'
import { Helmet } from 'react-helmet'
import { Nullable } from '../../types/common'
import School from '@mui/icons-material/School'
import NavBtnStack from './NavBtnStack'

export interface HeaderProps {
  title?: Nullable<string>
}


const StyledAppBar = styled(AppBar)`
  flex-flow: row;
  align-items: center;
  position: sticky;
  top: 0;
  padding: 0 20px;
  height: ${HEADER_HEIGHT}px;
`

const DIS = headerStore.height + 20
const Header: React.FC<HeaderProps> = observer((props) => {
  const { title } = props
  const { title: siteTitle, description } = useSiteMetadata()
  const [elevation, setElevation] = useState(0)

  if (typeof window !== 'undefined') {
    useScroll(({ xy: [, y], delta: [, dy] }) => {
      headerStore.setOnTop(y <= DIS)
      setElevation(y > 0 ? 2 : 0)
      if (dy < -10 || y <= DIS) headerStore.setAppear(true)
      if (dy > 5) headerStore.setAppear(false)
    }, {
      target: window,
      enabled: !headerStore.appearLock,
      eventOptions: {
        passive: true,
      },
    })
  }

  return (
    <>
      <Helmet title={`${title ? title + ' - ' : ''}${siteTitle}`}>
        <meta name="description" content={description}/>
      </Helmet>

      <Slide appear={false} direction="down" in={headerStore.appear}>
        <StyledAppBar elevation={elevation}>
          <Tooltip title="Link to homepage">
            <IconButton component={Link} color="inherit" to="/">
              <School/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Link to homepage">
            <Button
              component={Link}
              to="/"
              sx={{
                fontSize: theme => theme.typography.h6.fontSize,
                color: 'inherit',
              }}>
              {siteTitle}
            </Button>
          </Tooltip>

          <Grid flexGrow={1}/>

          <NavBtnStack/>
        </StyledAppBar>
      </Slide>
    </>
  )
})

export default Header
