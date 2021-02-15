import {
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  makeStyles,
} from '@material-ui/core'
import {
  ExpandMore as ExpandMoreIcon,
  Forum as ForumIcon,
} from '@material-ui/icons'
import React from 'react'
import Comment from './Comment'

function CommentSystem ({ title }) {
  return (
    <Comment
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
      clientID={process.env.GATSBY_GITHUB_CLIENT_ID}
      clientSecret={process.env.GATSBY_GITHUB_CLIENT_SECRET}
    />
  )
}

const useStyles = makeStyles({
  metaicon: {
    verticalAlign: 'sub',
  },
})
function CommentComponent ({ title }) {
  const classes = useStyles()
  return (
    <Accordion variant="outlined" defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="comment"
      >
        <Typography><ForumIcon fontSize="small" className={classes.metaicon} />{' 评论'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          <CommentSystem title={title} />
        </Container>
      </AccordionDetails>
    </Accordion>
  )
}

export default CommentComponent
