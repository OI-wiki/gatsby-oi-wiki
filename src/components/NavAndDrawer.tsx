import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { Link, navigate } from 'gatsby'
import React, { useContext } from 'react'
import createPersistedState from 'use-persisted-state'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import GitHubIcon from '@material-ui/icons/GitHub'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import SchoolIcon from '@material-ui/icons/School'
import TranslateIcon from '@material-ui/icons/Translate'
import { LanguagesContext, languages } from '../languageContext'
import scrollbarStyle from '../styles/scrollbar'
import defaultSettings from '../lib/defaultSettings'

import Search from './Search'
import SiderContent from './Sidebar'
import Tabs from './Tabs'

const drawerWidth = 250

interface AppBar{
  background: string;
  color: string;
}
interface Props{
  appBar: AppBar;
}

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
  appBar: (props: Props) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: props.appBar.background,
    color: props.appBar.color,
  }),
  toolbar: {
    paddingLeft: '7.5px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  placeholder: {
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
function LanguageSwitchButton ({ location }): React.ReactElement {
  return (
    <LanguagesContext.Consumer>
      {({ locale, setLocale }) => {
        const currentLanguage = locale === languages.zh ? 'zh' : 'en'
        const targetLanguage = locale === languages.zh ? 'en' : 'zh'
        const handleClick = (e):void => {
          setLocale(locale === languages.zh ? languages.en : languages.zh)
          setLocale(targetLanguage)
          navigate(location.replace(currentLanguage, targetLanguage))
        }
        return (
          <Tooltip title={locale.nav.language} placement="bottom" arrow>
            <IconButton color="inherit" onClick={handleClick}>
              <TranslateIcon />
            </IconButton>
          </Tooltip>
        )
      }}
    </LanguagesContext.Consumer>
  )
}
function flattenObject (ob:any) :Record<string, unknown> {
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

function getTabIDFromLocation (location: string, pathList: string[]): number {
  for (const v of Object.entries(pathList)) {
    if (Object.values(flattenObject(v[1])).indexOf(location) > -1) return +v[0]
  }
  return -1
}

interface drawerProps {
  pathname: string
}

const ResponsiveDrawer: React.FC<drawerProps> = (props) => {
  const { pathname } = props
  const [settings] = createPersistedState('settings')(defaultSettings)
  const theme = useTheme()
  const navColor = settings?.theme?.navColor !== 'auto' && typeof settings?.theme?.navColor !== 'undefined'
    ? settings.theme.navColor
    : theme.palette.background.paper // undefined or 'auto'
  const classes = useStyles({
    appBar: {
      background: navColor,
      color: theme.palette.getContrastText(navColor),
    },
  })
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const OIWikiGithub = 'https://github.com/OI-wiki/OI-wiki'
  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen)
  }
  const { locale } = useContext(LanguagesContext)
  const tabID = getTabIDFromLocation(pathname, locale.sidebarList)
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
            <MenuIcon />
          </IconButton>
          <Hidden mdDown implementation="css">
            <IconButton component={Link} color="inherit" to="/">
              <SchoolIcon />
            </IconButton>
          </Hidden>
          <Button href="/" color="inherit">
            <Typography variant="h6" noWrap>
              OI Wiki
            </Typography>
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Search />
          <LanguageSwitchButton location={pathname} />
          <Tooltip title={locale.nav.setting} placement="bottom" arrow>
            <IconButton component="a" href="/settings" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={locale.nav.tag} placement="bottom" arrow>
            <IconButton component="a" href="/tags" color="inherit">
              <LocalOfferIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={locale.nav.catalog} placement="bottom" arrow>
            <IconButton component="a" href="/pages" color="inherit">
              <LibraryBooksIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={locale.nav.github} placement="bottom" arrow>
            <IconButton component="a" href={OIWikiGithub} color="inherit">
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Hidden mdDown implementation="css">
          <Tabs tabID={tabID >= 0 ? tabID : 0} pathList={locale.sidebarList}/>
        </Hidden>
      </AppBar>
      <Hidden lgUp implementation="js">
        <Drawer
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
          <SiderContent pathList={locale.sidebarList} {...props} />
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
          <div className={classes.placeholder} />
          <SiderContent pathList={tabID !== -1 ? [locale.sidebarList[tabID]] : locale.sidebarList} {...props} />
        </Drawer>
      </Hidden>
    </>
  )
}

export default ResponsiveDrawer
