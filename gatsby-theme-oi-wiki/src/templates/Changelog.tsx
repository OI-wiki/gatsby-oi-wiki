import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { LogResult } from 'simple-git'
import Layout from '../components/Layout'
import TimelineItem from '@mui/lab/TimelineItem'
import styled from '@mui/material/styles/styled'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import Paper from '@mui/material/Paper'
import Time from '../components/Time'
import SmartLink from '../components/SmartLink'
import Grid from '@mui/material/Grid'
import { lightBlue } from '@mui/material/colors'
import Timeline from '@mui/lab/Timeline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import Divider from '@mui/material/Divider'
import Title from '../components/Title'


interface TimelineBlockProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

interface TimelineBlockListProps {
  changelog: LogResult;
  relativePath: string;
}

type HistoryBlockProps = Pick<TimelineBlockListProps, 'relativePath'>

interface ChangelogProps {
  pageContext: TimelineBlockListProps & {
    title: string;
  }
}


const StyledTimelineItem = styled(TimelineItem)`
  &:before {
    content: unset;
  }
`

const StyledTimelineOppositeContent = styled(TimelineOppositeContent)(({ theme }) => css`
  width: 200px;
  padding-top: 4px;
  flex: unset;

  ${theme.breakpoints.down('sm')} {
    order: 1;
    text-align: left;
    vertical-align: top;
  }
`)

const StyledTimelineContent = styled(TimelineContent)(({ theme }) => css`
  ${theme.breakpoints.down('sm')} {
    order: 2;
    margin-top: 20px;
    margin-left: -200px;
  }
`)

const StyledPaper = styled(Paper)(({ theme }) => css`
  padding: 6px 16px;
  margin-top: ${theme.spacing(1)};
`)

const TimelineBlock: React.FC<TimelineBlockProps> = (props) => {
  return (
    <StyledTimelineItem>
      <StyledTimelineOppositeContent>
        {props.left}
      </StyledTimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot variant="outlined"/>
        <TimelineConnector/>
      </TimelineSeparator>
      <StyledTimelineContent>
        <StyledPaper variant="outlined">
          {props.right}
        </StyledPaper>
      </StyledTimelineContent>
    </StyledTimelineItem>
  )
}

const AuthorTyp = styled(Typography)`
  margin: 0;
  line-height: 1.6em;
`

const HashLink = styled(SmartLink)`
  margin: 0 0 0 auto;
  color: inherit;

  &:hover {
    text-decoration: none;
    color: ${lightBlue[500]};
  }
`

const TimelineBlockList: React.FC<TimelineBlockListProps> = (props) => {
  const { changelog, relativePath } = props

  return <>
    {changelog.all.map((item, index) => {
      const { hash, date, message, author_name: author } = item
      return (
        <TimelineBlock
          key={index + '#'}
          left={
            <Typography variant="body2" color="textSecondary">
              <Time time={date}/>
            </Typography>
          }
          right={
            <>
              <Grid container={true} alignItems="center">
                <SmartLink href={`https://github.com/${author}`}>
                  <AuthorTyp variant="h5">
                    {author}
                  </AuthorTyp>
                </SmartLink>
                <HashLink href={`https://github.com/OI-wiki/OI-wiki/commit/${hash}/${relativePath}`}>
                  <Typography>{hash.substr(0, 7)}</Typography>
                </HashLink>
              </Grid>
              <Typography>{message}</Typography>
            </>
          }/>
      )
    })}
  </>
}

const HistoryBlock: React.FC<HistoryBlockProps> = (props) => {
  return (
    <TimelineBlock
      left="..."
      right={
        <>
          <Typography>...</Typography>
          {'在 '}
          <SmartLink href={`https://github.com/OI-wiki/OI-wiki/commits/master/${props.relativePath}`}>GitHub</SmartLink>
          {' 上查看完整历史'}
        </>
      }/>
  )
}

const BackBlock: React.FC = () => {
  return (
    <Box sx={{ mt: '30px' }}>
      <Divider/>
      <Button
        sx={{ mt: '8px', color: 'inherit' }}
        size="large"
        component={GatsbyLink}
        to="../"
        startIcon={<ArrowBackIos/>}>
        返回
      </Button>
    </Box>
  )
}

const ChangeLog: React.FC<ChangelogProps> = (props) => {
  const { title, changelog, relativePath } = props.pageContext
  const pageTitle = `更新历史${title ? ` - ${title}` : ''}`

  return (
    <Layout withNav={false} withToc={false} title={pageTitle}>
      <Title noEdit={true} relativePath={relativePath}>{pageTitle}</Title>

      <Timeline>
        <TimelineBlockList changelog={changelog} relativePath={relativePath}/>
        <HistoryBlock relativePath={relativePath}/>
      </Timeline>

      <BackBlock/>
    </Layout>
  )
}

export default ChangeLog
