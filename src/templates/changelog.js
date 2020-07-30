import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import Link from '@material-ui/core/Link'
import { Link } from 'gatsby'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import IconButton from '@material-ui/core/IconButton'
import { Divider } from '@material-ui/core'
import TimelineDot from '@material-ui/lab/TimelineDot'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import lightBlue from '@material-ui/core/colors/lightBlue'
import Layout from '../components/Layout'
import Time from '../components/Time.tsx'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: lightBlue[500],
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: lightBlue[500],
    },
    marginRight: '10px',
  },
  hashLink: {
    margin: '0 0 0 auto',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'none',
      color: lightBlue[500],
    },
  },
  timeBlock: {
    minWidth: '200px',
    maxWidth: '200px',
  },
  logContainer: {
    position: 'relative',
    height: '340px',
  },
  backContainer: {
    marginTop: '30px',
  },
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChangeLog = ({ pageContext: { title, changelog, relativePath }, location }) => {
  const classes = useStyles()
  return (
    <Layout location={location} noMeta="true" title={`更改记录 - ${title}`} relativePath={relativePath} noGithub="false">
      <Timeline>
        {changelog.all.map((item, index) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { hash, date, message, refs, body, author_name: author, author_email: email } = item
          return (
            <TimelineItem key={index + '#'}>
              <TimelineOppositeContent className={classes.timeBlock}>
                <Typography variant="body2" color="textSecondary">
                  <Time time={date} updateInterval={5 * 60 * 60 * 1000} defaultShowRelative={false}/>
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper variant="outlined" className={classes.paper}>
                  <div className={classes.infoContainer}>
                    <Link href={'https://github.com/' + author} className={classes.link}>
                      <Typography variant="h6" component="h1">
                        {author}
                      </Typography>
                    </Link>
                    <Typography>commited</Typography>
                    <Link href={`https://github.com/OI-wiki/gatsby-oi-wiki/commit/${hash}`}className={classes.hashLink}>
                      <Typography>{hash.substr(0, 7)}</Typography>
                    </Link>
                  </div>
                  <Typography>{message}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
      <div className={classes.backContainer}>
        <Divider />
        <IconButton component={Link} color="inherit" to="../" className={classes.link}>
          <ArrowBackIos /><Typography>{' '}返回上一页</Typography>
        </IconButton>
      </div>
    </Layout>
  )
}

export default ChangeLog
