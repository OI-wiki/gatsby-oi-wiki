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
    id = {`${title}`}
    repo = "_______"
    repoid = "_______"
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
