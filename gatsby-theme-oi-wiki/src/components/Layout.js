import {
  CssBaseline,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core'

import { makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import FormatPaintIcon from '@material-ui/icons/FormatPaint'
import React from 'react'
import { Helmet } from 'react-helmet'
import { CSSTransition } from 'react-transition-group'
// import useDarkMode from '../lib/useDarkMode'
import scrollbar from '../styles/scrollbar'
import {
  CustomCssBaseline,
  adaptiveTheme,
  LightCssBaseline,
  DarkCssBaseline,
  AutoCssBaseline,
  SecondaryColorCssBaseline,
} from '../theme'
import Comment from './Comment'
import BackTop from './BackTop'
import Footer from './Footer'
import Meta from './Meta'
import NavAndDrawer from './NavAndDrawer'
import ToC from './Toc'
import Title from './Title'
import '../styles/transition.css'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    [theme.breakpoints.down('md')]: {
      minHeight: 64,
    },
    minHeight: 48 + 64,
    alignItems: 'flex-start',
  },
  content: {
    flexGrow: 1,
    width: '100%',
  },
  main: {
    padding: theme.spacing(5),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
    minHeight: '100vh',
    '& .math-display': scrollbar(theme, {
      overflow: 'auto',
    }),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  footer: {
    background: theme.palette.footer.background,
    color: theme.palette.footer.text,
    padding: theme.spacing(3),
    [theme.breakpoints.up('lg')]: {
      marginLeft: 250,
    },
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      marginLeft: 250,
    },
    overflow: 'hidden',
  },
  wip: {
    margin: `${theme.spacing(2)}px 0px`,
  },
}))

function MyLayout ({
  children,
  location,
  authors,
  title,
  description,
  tags,
  headings,
  relativePath,
  modifiedTime,
  noMeta,
  noComment,
  noEdit,
  noToC,
  overflow,
  isWIP,
}) {
  const theme = useTheme()
  const classes = useStyles()
  // const pageTitle = title === 'OI Wiki' ? title : `${title} - OI Wiki`
  const displayToC = headings && noToC !== 'true'
  const gridWidthMdUp = overflow === 'true' ? 12 : 10
  const descriptionRes = description || 'OI Wiki 是一个编程竞赛知识整合站点，提供有趣又实用的编程竞赛知识以及其他有帮助的内容，帮助广大编程竞赛爱好者更快更深入地学习编程竞赛'
  const WIPAlert = (
    <Alert severity="info" icon={<FormatPaintIcon />} className={classes.wip}>
      本文内容尚不完善，我们正在努力施工中。您可以保存此页链接稍后再看，或者帮助我们修订此页面！
    </Alert>
  )
  return (
    <>
      <Helmet>
        <title>{`${title === 'OI Wiki' ? '' : title + ' - '}OI Wiki`}</title>
        <meta name="color-scheme" content="dark light" />
        <meta name="description" content={descriptionRes} />
      </Helmet>
      <NavAndDrawer pathname={location.pathname} />
      <div className="maincontentdiv">
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={gridWidthMdUp}
            lg={gridWidthMdUp}
            xl={gridWidthMdUp}
          >
            <div className={classes.toolbar} />
            <CSSTransition
              in
              appear
              timeout={600}
              classNames="fade"
            >
              <div className={classes.container}>
                <main className={classes.content}>
                  <div className={classes.main}>
                    <Title
                      title={title}
                      location={location}
                      noEdit={noEdit}
                      noMeta={noMeta}
                      relativePath={relativePath}
                    />
                    <Divider className={classes.divider} />
                    {isWIP && WIPAlert}
                    <Typography variant="body1" component="div">
                      {children}
                    </Typography>
                    {noMeta === 'false' && <Meta
                      authors={authors}
                      tags={tags}
                      relativePath={relativePath}
                      modifiedTime={modifiedTime}
                      location={location}
                      title={title}
                    />}
                    {noComment === 'false' && (
                      <div style={{ width: '100%', marginTop: theme.spacing(2) }}>
                        <Comment title={title} />
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </CSSTransition>
          </Grid>
        </Grid>
        <Divider />
        <div className={classes.footer}>
          <Footer />
        </div>
      </div>
      {displayToC && (
        <Grid item xs >
          <ToC toc={headings} pathname={location.pathname} />
        </Grid>
      )}
      <BackTop />
    </>
  )
}

function StyledLayout (props) {
  // const enableDark = useDarkMode()

  return (
    <ThemeProvider theme={adaptiveTheme}>
      <CssBaseline />
      <CustomCssBaseline />
      <LightCssBaseline />
      <DarkCssBaseline />
      <AutoCssBaseline />
      <SecondaryColorCssBaseline />
      <MyLayout {...props} />
    </ThemeProvider>
  )
}

export default StyledLayout
