import { AppBar, Button, Drawer, Hidden, IconButton, Toolbar, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { Link } from 'gatsby'
import React from 'react'
import { Menu as MenuIcon, School as SchoolIcon } from '@material-ui/icons'
import clsx from 'clsx'

import trimTrailingSlash from '../../lib/trailingSlash'
import pathList from '../../sidebar.yaml'
import SiderContent from '../Sidebar'
import Tabs from '../Tabs'
import SmallScreenMenu from '../SmallScreenMenu'
import { useStyles } from './styles'
import { flattenObject } from './utils'
import { useSetting } from '../../lib/useSetting'
import NavBtnGroup from './NavBtnGroup'
import Search from '../Search'

const getTabIDFromLocation = (location: string, pathList: string[]): number => {
  const locationTrimmed = trimTrailingSlash(location)
  for (const v of Object.entries(pathList)) {
    if (Object.values(flattenObject(v[1])).map(v => trimTrailingSlash(v as string)).indexOf(locationTrimmed) > -1) return +v[0]
  }
  return -1
}

interface ResponsiveDrawerProps {
  pathname: string
}

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = (props) => {
  const { pathname } = props
  const [settings] = useSetting()
  const theme = useTheme()
  const [navColor, textColor] = settings.theme.primary
    ? [settings.theme.primary.main, settings.theme.primary.contrastText]
    : [theme.palette.background.paper, 'rgba(var(--text-primary))']
  const classes = useStyles({
    appBar: {
      background: navColor,
      color: textColor as string,
    },
  })
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }
  const tabID = getTabIDFromLocation(pathname, pathList)

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>
          <Hidden mdDown implementation="css">
            <IconButton component={Link} color="inherit" to="/">
              <SchoolIcon/>
            </IconButton>
          </Hidden>
          <Button href="/" color="inherit">
            <Typography variant="h6" noWrap>
              OI Wiki
            </Typography>
          </Button>
          <div style={{ flexGrow: 1 }}/>
          <Search/>
          <Hidden smDown implementation="css">
            <NavBtnGroup/>
          </Hidden>
          <SmallScreenMenu/>
        </Toolbar>
        <Hidden mdDown implementation="css">
          <Tabs tabID={tabID >= 0 ? tabID : 0} pathList={pathList}/>
        </Hidden>
      </AppBar>
      <Hidden lgUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <SiderContent pathList={pathList} {...props} />
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          className={classes.drawer}
          classes={{ paper: clsx(classes.drawerPaper, classes.placeholderMargin) }}
          variant="permanent"
          open
        >
          <SiderContent pathList={tabID !== -1 ? [pathList[tabID]] : pathList} {...props} />
        </Drawer>
      </Hidden>
    </>
  )
}

const NavAndDrawer = React.memo(ResponsiveDrawer, (a, b) => a.pathname === b.pathname)

export default NavAndDrawer
