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
import Tooltip from '@material-ui/core/Tooltip'
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
    padding: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
    minHeight: "100vh",
    overflow: "inherit",
  },
  typo: {
    '& h2[id]:target:before': {
      [theme.breakpoints.down("md")]: {
        paddingTop: "70px",
        marginTop: "-70px",
      },
      paddingTop: "120px",
      marginTop: "-120px",
    },
    '& h2[id]:before': {
      display: "block", 
      content: '" "',
      marginTop: "-8px",
      paddingTop: "8px",
      position: "relative",
      zIndex: "-1",
    },
    "& h2": {
      position: "static!important"
    },
    '& h3[id]:target:before': {
      [theme.breakpoints.down("md")]: {
        paddingTop: "69px",
        marginTop: "-69px",
      },
      paddingTop: "119px",
      marginTop: "-119px",
    },
    '& h3[id]:before': {
      display: "block", 
      content: '" "',
      marginTop: "-8px",
      paddingTop: "8px",
      position: "relative",
      zIndex: "-1",
    },
    "& h3": {
      position: "static!important"
    },
    '& h4[id]:target:before': {
      [theme.breakpoints.down("md")]: {
        paddingTop: "68px",
        marginTop: "-68px",
      },
      paddingTop: "118px",
      marginTop: "-118px",
    },
    '& h4[id]:before': {
      display: "block", 
      content: '" "',
      marginTop: "-8px",
      paddingTop: "8px",
      position: "relative",
      zIndex: "-1",
    },
    "& h4": {
      position: "static!important"
    },
    '& h5[id]:target:before': {
      [theme.breakpoints.down("md")]: {
        paddingTop: "68px",
        marginTop: "-68px",
      },
      paddingTop: "116px",
      marginTop: "-116px",
    },
    '& h5[id]:before': {
      display: "block", 
      content: '" "',
      marginTop: "-8px",
      paddingTop: "8px",
      position: "relative",
      zIndex: "-1",
    },
    "& h5": {
      position: "static!important"
    },
    '& h6[id]:target:before': {
      [theme.breakpoints.down("md")]: {
        paddingTop: "67px",
        marginTop: "-67px",
      },
      paddingTop: "114px",
      marginTop: "-114px",
    },
    '& h6[id]:before': {
      display: "block", 
      content: '" "',
      marginTop: "-8px",
      paddingTop: "8px",
      position: "relative",
      zIndex: "-1",
    },
    "& h6": {
      position: "static!important"
    },
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
    [theme.breakpoints.up("lg")]: {
      marginLeft: 250,
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
      <Helmet>
        <title>{`${title === "OI Wiki" ? "" : title + " - "}OI Wiki`}</title>
      </Helmet>
      {EditingDialog}
      <NavAndDrawer pathname={location.pathname}/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={10} sm={12} lg={10} xl={10}>
          <div className={classes.toolbar}/>
          <div className={classes.container}>
            <main className={classes.content}>
              <div className={classes.main}>
                <Grid container spacing={2}>
                  <Grid item xs>
                    <Typography variant="h4" component="h3">
                      {pageTitle}
                    </Typography>
                  </Grid>
                  {noEdit === "false" && (
                    <Grid item xs={1}>
                      <Tooltip title="编辑页面" placement="left">
                        <IconButton
                          onClick={() => setDialogOpen(true)}
                          className={classes.iconButton}
                        >
                          <MdEdit fontSize="medium"/>
                        </IconButton>
                      </Tooltip>
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
        </Grid>
        {
          displayToC &&
          <Grid item xs>
            <ToC toc={toc} pathname={location.pathname}/>
          </Grid>
        }
      </Grid>
      <Divider/>
      <div className={classes.footer}>
        <Footer/>
      </div>
      <BackTop/>
    </>
  )
}

export default myLayout
