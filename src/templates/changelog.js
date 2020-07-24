import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import lightBlue from '@material-ui/core/colors/lightBlue'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  link: {
    '&:hover': {
      textDecoration: 'none',
      color: lightBlue[500],
    },
  },
  timeBlock: {
    minWidth: '200px',
    maxWidth: '200px',
  },
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChangeLog = ({ pageContext: { slug }, data, location }) => {
  const classes = useStyles()
  const { nodes: changelog } = data.allChangeLog
  return (
    <Layout location={location} noMeta="true" title="更改记录">
      <Timeline>
        {changelog.map((item, index) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // const { hash, date, message, refs, body, author_name: name, author_email: email } = item
          const { date, author, message } = item
          return (
            <TimelineItem key={index + '#'}>
              <TimelineOppositeContent className={classes.timeBlock}>
                <Typography variant="body2" color="textSecondary">
                  {new Date(date).toLocaleString()}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot variant="outlined" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper variant="outlined" className={classes.paper}>
                  <Typography variant="h6" component="h1">
                    <Link href={'https://github.com/' + author}>{author}</Link>
                  </Typography>
                  <Typography>{message}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Layout>
  )
}

export default ChangeLog

export const pageQuery = graphql`
  query($slug: String) {
    allChangeLog(filter: {filepath: {eq: $slug}}) {
      nodes {
        author
        date
        filepath
        message
      }
    }
  }
`
