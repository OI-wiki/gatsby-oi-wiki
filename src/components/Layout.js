/** @jsx jsx */
import { jsx } from "theme-ui"
//Components
import Navbar from "./NavAndDrawer"
import Meta from "./Meta"
import Loadable from "react-loadable"
import { Helmet } from "react-helmet"
import { useTheme, makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CssBaseline from "@material-ui/core/CssBaseline"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { Divider } from "@material-ui/core"
const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
    <div sx={{ display: "flex" }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CssBaseline />
      <Navbar pathname={location.pathname} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Card>
          <CardContent>
            <Typography variant="h3" component="h2">
              {pageTitle}
            </Typography>
            <Divider className={classes.divider} />
            <Typography variant="body1" component="div">
              {children}
            </Typography>
            <Divider className={classes.divider} />
            <Meta
              authors={authors}
              tags={tags}
              relativePath={relativePath}
              modifiedTime={modifiedTime}
              noMeta={noMeta}
            />
          </CardContent>
        </Card>

        <div sx={{ marginLeft: 24, marginRight: 24 }}>
          <LazyComment title={title} noComment={noComment}></LazyComment>
        </div>
      </main>
    </div>
  )
}

export default myLayout
