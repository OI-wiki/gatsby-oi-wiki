/** @jsx jsx */
import { jsx } from "theme-ui"
//Components
import Navbar from "./NavAndDrawer"
import Meta from "./Meta"
import Loadable from "react-loadable"
import { Helmet } from "react-helmet"
import { useTheme, makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import { MdExpandMore } from "react-icons/md"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import CssBaseline from "@material-ui/core/CssBaseline"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { Divider } from "@material-ui/core"
import Footer from "./Footer"
import Toc from "./Toc"
import React from "react"
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
  },
  main: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(1),
    minHeight: "100vh",
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  footer: {
    background: "#fff",
    padding: theme.spacing(3),
  },
  container: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - 20%)`,
    },
  },
}))

const LazyComment = Loadable({
  loader: () => import("./Comment"),
  loading: () => <div />,
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
      <div sx={{ display: "flex" }} className={classes.container}>
        <Helmet>
          <title>{`${title === "OI Wiki" ? "" : title + " - "}OI Wiki`}</title>
        </Helmet>
        <CssBaseline />
        <Navbar pathname={location.pathname} />
        <main className={classes.content}>
          <div className={classes.main}>
            <div className={classes.toolbar} />
            <Card>
              <CardContent sx={{ padding: theme.spacing(4) }}>
                <Typography variant="h3" component="h2">
                  {pageTitle}
                </Typography>
                <Divider className={classes.divider} />
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
                  expandIcon={<MdExpandMore />}
                  aria-controls="comment"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>评论</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div sx={{ marginLeft: 24, marginRight: 24 }}>
                    <LazyComment title={title}></LazyComment>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
          </div>
          <Divider />
          <div className={classes.footer}>
            <Footer />
          </div>
        </main>
      </div>
      {toc.items && (
        <Toc toc={toc} key={location.key} pathname={location.pathname} />
      )}
    </>
  )
}

export default myLayout
