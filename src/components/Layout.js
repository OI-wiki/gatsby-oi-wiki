/** @jsx jsx */
import Button from "@material-ui/core/Button"
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { MdEdit, MdExpandMore } from "react-icons/md"
import Loadable from "react-loadable"
import { jsx } from "theme-ui"
import BackTop from "./BackTop"
import Footer from "./Footer"
import Link from "./Link"
import Meta from "./Meta"
//Components
import NavAndDrawer from "./NavAndDrawer"
import ToC from "./Toc"

const editWarning = (
  <DialogContentText>
    <p>首先，感谢您能够为 OI Wiki 做出自己的贡献。</p>
    <p>
      不过在开始之前，我们需要您了解并熟知
      <Link to={"/intro/htc/"}>如何参与</Link>
      里的内容，以避免在编辑时产生不必要的麻烦。
    </p>
    <p>在阅读完之后，请点击下方的按钮，然后开始编辑。</p>
  </DialogContentText>
)
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
    padding: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
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
  containerNoToC: {
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
                    noToC,
                  }) {
  const classes = useStyles()
  const theme = useTheme()
  const pageTitle = title === "OI Wiki" ? title : `${title} - OI Wiki`
  const displayToC = toc && toc.items && noToC !== "true"
  const editURL = "https://github.com/OI-wiki/OI-wiki/edit/master/docs/"
  const [dialogOpen, setDialogOpen] = useState(false)
  const EditingDialog = (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false)
      }}
    >
      <DialogTitle>{"编辑前须知"}</DialogTitle>
      <DialogContent>{editWarning}</DialogContent>
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
      <div sx={{ display: "flex" }} className={displayToC ? classes.container : classes.containerToC}>
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
                <ExpansionPanel variant={"outlined"}>
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
      {displayToC && <ToC toc={toc} pathname={location.pathname}/>}
      <Divider/>
      <div className={classes.footer}>
        <Footer/>
      </div>
      <BackTop/>
    </>
  )
}

export default myLayout
