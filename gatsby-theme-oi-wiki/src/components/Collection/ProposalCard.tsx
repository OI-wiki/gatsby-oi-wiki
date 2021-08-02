import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Badge, CircularProgress, Container, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { CollectionClient } from './CollectionClient'
import { CollectionItem, CollectionUser, SortMethod } from './types'
import { ExpandMore as ExpandMoreIcon, ThumbUp as ThumbUpIcon, Comment as CommentIcon } from '@material-ui/icons'
interface ProposalCardProps extends CollectionItem {
  client: CollectionClient;
  sortMethod: SortMethod;
  user: CollectionUser;
}
const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    marginBottom: theme.spacing(1),
  },
}))
const ProposalCard: React.FC<ProposalCardProps> = (props) => {
  const {
    client,
    name,
    commentCount,
    url,
    id,
    description,
  } = props
  const styles = useStyles()
  const [supportStateLoaded, setSupportStateLoaded] = useState(false)
  const [selfSupported, setSelfSupported] = useState(false)
  const [supportCount, setSupportCount] = useState(props.supportCount)
  const [expanding, setExpanding] = useState(false)
  useEffect(() => {
    if (!supportStateLoaded) {
      client.getSelfSupported(id).then(ok => {
        setSelfSupported(ok)
        setSupportStateLoaded(true)
      })
    }
  }, [client, id, supportStateLoaded])
  return <div className={styles.card}>
    <Accordion defaultExpanded={false} expanded={expanding} onChange={() => setExpanding(!expanding)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon></ExpandMoreIcon>}
      >
        <Grid container>
          <Grid xs={9} item>
            <Typography style={{ wordBreak: 'break-word' }}>
              {name}
            </Typography>
          </Grid>
          <Grid xs={3} item>
            <Grid container justifyContent='center'>
              <Grid item xs={6}>
                <Badge
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={supportCount}
                  max={99}
                  color='primary'
                >
                  <ThumbUpIcon />
                </Badge>
              </Grid>
              <Grid item xs={6}>
                <Badge
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={commentCount}
                  max={99}
                  color='primary'
                >
                  <CommentIcon />
                </Badge>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          {/* {commentLoading && <Grid container justifyContent='center'>
            <Grid item>
              <CircularProgress></CircularProgress>
            </Grid>
          </Grid>} */}
          {url !== '' && <Container>
            题目链接: <a href={url} target='_blank' rel='noreferrer'>
              {url}
            </a>
          </Container>}
          <Container style={{ wordBreak: 'break-word' }}>
            {description}
          </Container>
        </Container>
      </AccordionDetails>
    </Accordion>
  </div>
}

export default ProposalCard
