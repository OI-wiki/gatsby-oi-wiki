/** @jsx jsx */
import { jsx } from "theme-ui"
//Components
import NavAndDrawer from "./NavAndDrawer"
import { MdEdit } from "react-icons/md"
import IconButton from '@material-ui/core/IconButton';
import Meta from "./Meta"
import Loadable from "react-loadable"
import { Helmet } from "react-helmet"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import { MdExpandMore } from "react-icons/md"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import CssBaseline from "@material-ui/core/CssBaseline"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import Container from "@material-ui/core/Container"
import Footer from "./Footer"
import React from "react"
import Grid from '@material-ui/core/Grid';
import ToC from "./Toc"
import BackTop from "./BackTop"

const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.down("md")]: {
      minHeight: 64,
    },
    minHeight: 48 + 64,
    alignItems: "flex-start",
  },
  content: {
    flexGrow: 1,
    width: "100%",
    overflow: "inherit",
  },
  main: {
    padding: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(1),
    },
    minHeight: "100vh",
    overflow: "inherit",
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  footer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(3),
    [theme.breakpoints.up("lg")]: {
      marginLeft: 250,
    },
  },
  container: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - 15%)`,
    },
    overflow: "auto",
  },
  iconbutton: {
    float: 'right'
  },
}))

const LazyComment = Loadable({
  loader: () => import("./Comment"),
  loading: () => <div/>,
})

function myLayout({
                    children,
                    location,
                    authors,
                    title,
                    description,
                    tags,
                    toc,
                    relativePath,
                    modifiedTime,
                    noMeta,
                    noComment,
                  }) {
  const classes = useStyles()
  const theme = useTheme()
  const pageTitle = title === "OI Wiki" ? title : `${title} - OI Wiki`
  const editURL = "https://github.com/OI-wiki/OI-wiki/edit/master/docs/"
  return (
    <>
      <CssBaseline/>
      <div sx={{ display: "flex" }} className={classes.container}>
        <Helmet>
          <title>{`${title === "OI Wiki" ? "" : title + " - "}OI Wiki`}</title>
        </Helmet>
        <NavAndDrawer pathname={location.pathname}/>
        <main className={classes.content}>
          <div className={classes.main}>
            <div className={classes.toolbar}/>
            <Card sx={{ overflow: "inherit" }} elevation={3}>
              <CardContent
                sx={{
                  overflow: "auto",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs>
                    <Typography variant="h4" component="h3">
                      {pageTitle}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <IconButton
                      component="a"
                      className={classes.iconbutton}
                      href={editURL + relativePath}
                      target="_blank"
                      rel="noopener nofollow"
                    >
                      <MdEdit font-size="small"/>
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider className={classes.divider}/>
                <Typography variant="body1" component="div">
                  {children}
                </Typography>
                <Meta
                  authors={authors}
                  tags={tags}
                  relativePath={relativePath}
                  modifiedTime={modifiedTime}
                  noMeta={noMeta}
                />
              </CardContent>
            </Card>
            {noComment === "false" && (
              <div style={{ width: "100%", marginTop: theme.spacing(2) }}>
                <ExpansionPanel elevation={3}>
                  <ExpansionPanelSummary
                    expandIcon={<MdExpandMore/>}
                    aria-controls="comment"
                  >
                    <Typography className={classes.heading}>评论</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Container>
                      <LazyComment title={title}/>
                    </Container>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            )}
          </div>
        </main>
      </div>
      {toc && toc.items && (
        <ToC toc={toc} pathname={location.pathname}/>
      )}
      <Divider/>
      <div className={classes.footer}>
        <Footer/>
      </div>
      <BackTop/>
    </>
  )
}

export default myLayout
