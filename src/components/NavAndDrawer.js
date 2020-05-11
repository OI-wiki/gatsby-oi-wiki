import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { Link } from 'gatsby'
import React from 'react'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import GitHubIcon from '@material-ui/icons/GitHub'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import SchoolIcon from '@material-ui/icons/School'

import scrollbarStyle from '../styles/scrollbar'
import pathList from '../sidebar.yaml'
import Search from './Search'
import SiderContent from './Sidebar'
import Tabs from './Tabs'

const drawerWidth = 250

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  hiddenDrawer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    [theme.breakpoints.down('md')]: {
      minHeight: 64,
    },
    minHeight: 48 + 64,
    alignItems: 'flex-start',
  },
  drawerPaper: scrollbarStyle(theme, {
    width: drawerWidth,
  }),
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

function flattenObject (ob) {
  // https://stackoverflow.com/a/53739792
  const toReturn = {}

  for (const i in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, i)) continue

    if ((typeof ob[i]) === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i])
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}

function getTabIDFromLocation (location, pathList) {
  for (const v of Object.entries(pathList)) {
    if (Object.values(flattenObject(v[1])).indexOf(location) > -1) return +v[0]
  }
  return false
}

function ResponsiveDrawer (props) {
  const { container, pathname } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const OIWikiGithub = 'https://github.com/OI-wiki/OI-wiki'
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const tabID = getTabIDFromLocation(pathname, pathList)
  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Hidden mdDown implementation="css">
            <IconButton component={Link} color="inherit" to="/">
              <SchoolIcon />
            </IconButton>
          </Hidden>
          <Button href="/">
            <Typography variant="h6" noWrap>
              OI Wiki
            </Typography>
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Search />
          <Tooltip title="设置页" placement="bottom" arrow>
            <IconButton component="a" href="/settings" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="标签页" placement="bottom" arrow>
            <IconButton component="a" href="/tags" color="inherit">
              <LocalOfferIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="目录页" placement="bottom" arrow>
            <IconButton component="a" href="/pages" color="inherit">
              <LibraryBooksIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="GitHub 存储库" placement="bottom" arrow>
            <IconButton component="a" href={OIWikiGithub} color="inherit">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Hidden mdDown implementation="css">
          <Tabs tabID={tabID} pathList={pathList}/>
        </Hidden>
      </AppBar>
      <Hidden lgUp implementation="js">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
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
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <div className={classes.toolbar} />
          <SiderContent pathList={tabID !== false ? [pathList[tabID]] : pathList} {...props} />
        </Drawer>
      </Hidden>
    </>
  )
}

export default ResponsiveDrawer
