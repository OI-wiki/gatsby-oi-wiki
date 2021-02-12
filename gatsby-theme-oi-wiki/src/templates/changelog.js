import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineSeparator,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@material-ui/lab'
import { Divider, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Button from '@material-ui/core/Button'
import lightBlue from '@material-ui/core/colors/lightBlue'

import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import Layout from '../components/Layout'
import Time from '../components/Time.tsx'
import LinkGetter from '../components/Link'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
    marginTop: theme.spacing(1),
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
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
  const Link = LinkGetter(location)
  return (
    <Layout location={location} noMeta="true" title={`更改记录 - ${title}`}>
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
                    <Link href={`https://github.com/${author}`}>
                      <Typography variant="h6" component="h6">
                        {author}
                      </Typography>
                    </Link>
                    <Link
                      href={`https://github.com/OI-wiki/gatsby-oi-wiki/commit/${hash}`}
                      className={classes.hashLink}
                    >
                      <Typography>{hash.substr(0, 7)}</Typography>
                    </Link>
                  </div>
                  <Typography>{message}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          )
        })}
        <TimelineItem>
          <TimelineOppositeContent className={classes.timeBlock}>
            ...
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot variant="outlined" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper variant="outlined" className={classes.paper}>
              <Typography variant="h6" component="h6">
                ...
              </Typography>
              在 <Link href={`https://github.com/OI-wiki/gatsby-oi-wiki/commits/master/${relativePath}`}>GitHub</Link> 上查看完整历史
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <div className={classes.backContainer}>
        <Divider />
        <Button component={GatsbyLink} style={{ marginTop: '8px' }} size="large" color="inherit" to="../" startIcon={<ArrowBackIos />}>
          返回
        </Button>
      </div>
    </Layout>
  )
}

export default ChangeLog
