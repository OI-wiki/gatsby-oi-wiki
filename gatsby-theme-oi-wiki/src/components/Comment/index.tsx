import { Accordion, AccordionDetails, AccordionSummary, Container, makeStyles, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon, Forum as ForumIcon } from '@material-ui/icons'
import React from 'react'
import CommentComponent from './Comment'

export interface CommentSystemProps {
  title: string
}

export type CommentComponentProps = CommentSystemProps

const CommentSystem: React.FC<CommentSystemProps> = ({ title }) => (
  <CommentComponent
    id={`${title} - OI Wiki`}
    owner="OI-wiki"
    repo="gitment"
    admin={[
      '24OI-bot',
      'Enter-tainer',
      'Ir1d',
      'cjsoft',
      'billchenchina',
      'Xeonacid',
      'StudyingFather',
      'ouuan',
      'sshwy',
      'Marcythm',
    ]}
    clientID={process.env.GATSBY_GITHUB_CLIENT_ID || ''}
    clientSecret={process.env.GATSBY_GITHUB_CLIENT_SECRET || ''}
  />
)

const useStyles = makeStyles({
  metaIcon: {
    verticalAlign: 'sub',
  },
})

const Comment: React.FC<CommentComponentProps> = ({ title }) => {
  const classes = useStyles()
  return (
    <Accordion variant="outlined" defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="comment"
      >
        <Typography><ForumIcon fontSize="small" className={classes.metaIcon}/>{' 评论'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          <CommentSystem title={title}/>
        </Container>
      </AccordionDetails>
    </Accordion>
  )
}

export default Comment
