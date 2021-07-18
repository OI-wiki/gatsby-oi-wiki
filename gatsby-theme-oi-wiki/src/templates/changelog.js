import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab'
import { Divider, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Button from '@material-ui/core/Button'
import lightBlue from '@material-ui/core/colors/lightBlue'

import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import Time from '../components/Time.tsx'
import { SmartLink } from '../components/Link'
import StyledLayout from '../components/StyledLayout'

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
  return (
    <StyledLayout location={location} noMeta={true} title={`更新历史 - ${title}`}>
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
                <TimelineDot variant="outlined"/>
                <TimelineConnector/>
              </TimelineSeparator>
              <TimelineContent>
                <Paper variant="outlined" className={classes.paper}>
                  <div className={classes.infoContainer}>
                    <SmartLink href={`https://github.com/${author}`}>
                      <Typography variant="h6" component="h6">
                        {author}
                      </Typography>
                    </SmartLink>
                    <SmartLink
                      href={`https://github.com/OI-wiki/OI-wiki/commit/${hash}/${relativePath}`}
                      className={classes.hashLink}
                    >
                      <Typography>{hash.substr(0, 7)}</Typography>
                    </SmartLink>
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
            <TimelineDot variant="outlined"/>
            <TimelineConnector/>
          </TimelineSeparator>
          <TimelineContent>
            <Paper variant="outlined" className={classes.paper}>
              <Typography variant="h6" component="h6">
                ...
              </Typography>
              {'在 '}
              <SmartLink href={`https://github.com/OI-wiki/OI-wiki/commits/master/${relativePath}`}>GitHub</SmartLink>
              {' 上查看完整历史'}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <div className={classes.backContainer}>
        <Divider/>
        <Button component={GatsbyLink} style={{ marginTop: '8px' }} size="large" color="inherit" to="../"
                startIcon={<ArrowBackIos/>}>
          返回
        </Button>
      </div>
    </StyledLayout>
  )
}

export default ChangeLog
