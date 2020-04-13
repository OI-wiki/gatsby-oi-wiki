/** @jsx jsx */
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks"
import LocalOfferIcon from "@material-ui/icons/LocalOffer"
import SearchIcon from "@material-ui/icons/Search"
import { Link } from "gatsby"
import React from "react"
import { FaGithub } from "react-icons/fa"
import { MdMenu, MdSchool } from "react-icons/md"
import { jsx } from "theme-ui"
import tabData from "../tabs.yaml"
import Search from "./Search"
import SiderContent from "./Sidebar"
import Tabs from "./Tabs"

const drawerWidth = 250

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  hiddenDrawer: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    [theme.breakpoints.down("md")]: {
      minHeight: 64,
    },
    minHeight: 48 + 64,
    alignItems: "flex-start",
  },
  drawerPaper: {
    width: drawerWidth,
    "&::-webkit-scrollbar": {
      width: ".4rem",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.divider,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: fade(theme.palette.primary.main, 0.44),
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

function ResponsiveDrawer(props) {
  const { container, pathname } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const OIWikiGithub = "https://github.com/OI-wiki/OI-wiki"
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
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
            <MdMenu/>
          </IconButton>
          <Hidden mdDown implementation={"css"}>
            <IconButton component={Link} color="inherit" to="/">
              <MdSchool/>
            </IconButton>
          </Hidden>
          <Button
            href="/"
            sx={
              {
                /*color: "#fff"*/
              }
            }
          >
            <Typography variant="h6" noWrap>
              OI Wiki
            </Typography>
          </Button>
          <div style={{ flexGrow: 1 }}/>
          <Hidden smDown implementation="css">
            <Search/>
          </Hidden>
          <Hidden mdUp implementation={"css"}>
            <IconButton color={"inherit"}>
              <SearchIcon/>
            </IconButton>
          </Hidden>
          <Tooltip title="标签页" placement="bottom" arrow>
            <IconButton component={"a"} href={"/tags"} color={"inherit"}>
              <LocalOfferIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="目录页" placement="bottom" arrow>
            <IconButton component={"a"} href={"/pages"} color={"inherit"}>
              <LibraryBooksIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="GitHub 存储库" placement="bottom" arrow>
            <IconButton component={"a"} href={OIWikiGithub} color={"inherit"}>
              <FaGithub/>
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Hidden mdDown implementation={"css"}>
          <Tabs tabs={tabData} location={pathname}/>
        </Hidden>
      </AppBar>
      <Hidden lgUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <SiderContent {...props} />
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
          <div className={classes.toolbar}/>
          <SiderContent {...props} />
        </Drawer>
      </Hidden>
    </>
  )
}

export default ResponsiveDrawer
