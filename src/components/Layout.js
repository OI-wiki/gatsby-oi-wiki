/** @jsx jsx */
import { jsx } from "theme-ui"
//Components
import NavAndDrawer from "./NavAndDrawer"
import IconButton from "@material-ui/core/IconButton"
import Meta from "./Meta"
import Loadable from "react-loadable"
import { Helmet } from "react-helmet"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import { MdEdit, MdExpandMore } from "react-icons/md"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import CssBaseline from "@material-ui/core/CssBaseline"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import Container from "@material-ui/core/Container"
import Footer from "./Footer"
import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import ToC from "./Toc"
import BackTop from "./BackTop"
import { Dialog } from "@material-ui/core"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Link from "./Link"

const editWarning =
  <DialogContentText>
    <p>首先，感谢您能够为 OI Wiki 做出自己的贡献。</p>
    <p>不过在开始之前，我们需要您了解并熟知
      <Link to={"/intro/htc/"}>
        如何参与
      </Link>
      里的内容，以避免在编辑时产生不必要的麻烦。</p>
    <p>在阅读完之后，请点击下方的按钮，然后开始编辑。</p>
  </DialogContentText>
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
    background: "#f1f3f4",
    color: "#616161",
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
  iconButton: {
    float: "right",
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
                    noEdit,
                  }) {
  const classes = useStyles()
  const theme = useTheme()
  const pageTitle = title === "OI Wiki" ? title : `${title} - OI Wiki`
  const editURL = "https://github.com/OI-wiki/OI-wiki/edit/master/docs/"
  const [dialogOpen, setDialogOpen] = useState(false)
  const EditingDialog = (
    <Dialog open={dialogOpen} onClose={() => {
      setDialogOpen(false)
    }}>
      <DialogTitle>{"编辑前须知"}</DialogTitle>
      <DialogContent>
        {editWarning}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false)
          }}
        >
          取消
        </Button>
        <Button
          component="a"
          href={editURL + relativePath}
          target="_blank"
          rel="noopener nofollow"
          onClick={() => {
            setDialogOpen(false)
          }}
        >
          开始编辑
        </Button>
      </DialogActions>
    </Dialog>
  )
  return (
    <>
      <CssBaseline/>
      {EditingDialog}
      <div sx={{ display: "flex" }} className={classes.container}>
        <Helmet>
          <title>{`${title === "OI Wiki" ? "" : title + " - "}OI Wiki`}</title>
        </Helmet>
        <NavAndDrawer pathname={location.pathname}/>
        <main className={classes.content}>
          <div className={classes.main}>
            <div className={classes.toolbar}/>
            
                <Grid container spacing={2}>
                  <Grid item xs>
                    <Typography variant="h4" component="h3">
                      {pageTitle}
                    </Typography>
                  </Grid>
                  {noEdit === "false" && (
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => setDialogOpen(true)}
                        className={classes.iconButton}
                      >
                        <MdEdit font-size="medium"/>
                      </IconButton>
                    </Grid>
                  )}
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
