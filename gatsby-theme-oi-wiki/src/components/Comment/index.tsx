import React from 'react'
import CommentBlock from './CommentBlock'
import Forum from '@mui/icons-material/Forum'
import styled from '@mui/material/styles/styled'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import AccordionDetails from '@mui/material/AccordionDetails'
import Container from '@mui/material/Container'

export interface CommentSystemProps {
  title: string
}

export type CommentComponentProps = CommentSystemProps

const CommentSystem: React.FC<CommentSystemProps> = ({ title }) => (
  <CommentBlock
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

const StyledForumIcon = styled(Forum)`
  vertical-align: sub;
  font-size: small;
`

const Comment: React.FC<CommentComponentProps> = (props) => {
  const { title } = props

  return (
    <Accordion variant="outlined" defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMore/>} aria-controls="comment">
        <Typography><StyledForumIcon/>{' 评论'}</Typography>
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
