/** @jsx jsx */
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import InputBase from "@material-ui/core/InputBase"
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Tooltip from '@material-ui/core/Tooltip'
import Typography from "@material-ui/core/Typography"
import { Link } from "gatsby"
import React from "react"
import { FaGithub } from "react-icons/fa"
import { MdMenu, MdSchool, MdSearch } from "react-icons/md"
import { jsx } from "theme-ui"
import tabData from "../tabs.yaml"
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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
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
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <MdSearch/>
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          </Hidden>
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
