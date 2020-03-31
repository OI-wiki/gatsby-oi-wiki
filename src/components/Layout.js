/** @jsx jsx */
import { jsx } from "theme-ui"
//Components
import NavAndDrawer from "./NavAndDrawer"
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

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    width: "100%",
  },
  main: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0.5),
    },
    minHeight: "100vh",
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  footer: {
    background: "#fff",
    padding: theme.spacing(3),
    [theme.breakpoints.up("lg")]: {
      marginLeft: 300,
    },
  },
  container: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - 20%)`,
    },
  },
}))

const LazyComment = Loadable({
  loader: () => import("./Comment"),
  loading: () => <div/>,
})

const LazyToc = Loadable({
  loader: () => import("./Toc"),
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
            <Card>
              <CardContent>
                <Typography variant="h4" component="h3">
                  {pageTitle}
                </Typography>
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
              <ExpansionPanel sx={{ marginTop: theme.spacing(2) }}>
                <ExpansionPanelSummary
                  expandIcon={<MdExpandMore/>}
                  aria-controls="comment"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>评论</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Container>
                    <LazyComment title={title}/>
                  </Container>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
          </div>

        </main>
      </div>
      {toc && toc.items && (
        <LazyToc toc={toc} key={location.key} pathname={location.pathname}/>
      )}
      <Divider/>
      <div className={classes.footer}>
        <Footer/>
      </div>
    </>
  )
}

export default myLayout
