// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Accordion, AccordionDetails, AccordionSummary, Badge, Button, Container, createStyles, Grid, makeStyles, Typography, Theme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { ExpandMore as ExpandMoreIcon, ThumbUp as ThumbUpIcon, Comment as CommentIcon, Delete as DeleteIcon } from '@material-ui/icons'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProposalMeta, SortMethod, CollectionUser, GeneralGithubUser } from './types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionClient } from './CollectionClient'
import ProposalComments from './ProposalComments'

interface ProposalCardProps extends ProposalMeta {
  client: CollectionClient;
  sortMethod: SortMethod;
  user: CollectionUser;
  id: number;
  commentCount: number;
  supportCount: number;
  nodeId: string;
  proposalUser: GeneralGithubUser;
  updateSupportCount: (val: number) => void;
  removeCallback: () => void;
}
const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    marginBottom: theme.spacing(1),
  },
  utilsContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  utilsButton: {
    marginRight: theme.spacing(1),
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
    user,
    nodeId,
    supportCount,
    proposalUser,
    updateSupportCount,
    removeCallback,
  } = props
  const styles = useStyles()
  const [supportStateLoaded, setSupportStateLoaded] = useState(false)
  const [selfSupported, setSelfSupported] = useState(false)
  const [expanding, setExpanding] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [removing, setRemoving] = useState(false)
  const alreadyLogin = user.login
  useEffect(() => {
    if (!supportStateLoaded && user.login) {
      client.getSelfSupported(id).then(ok => {
        setSelfSupported(ok)
        setSupportStateLoaded(true)
      })
    }
  }, [client, id, supportStateLoaded, user.login])
  const toggleSelfSupportState = async (): Promise<void> => {
    setToggling(true)
    if (selfSupported) {
      await client.setSupportState(nodeId, false)
      updateSupportCount(supportCount - 1)
    } else {
      await client.setSupportState(nodeId, true)
      updateSupportCount(supportCount + 1)
    }
    setToggling(false)
    setSelfSupported(b => !b)
  }
  const removeThisProposal = async (): Promise<void> => {
    setRemoving(true)
    await client.deleteProposal(nodeId)
    setRemoving(false)
    removeCallback()
  }
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
          {url !== '' && <Container>
            题目链接: <a href={url} target='_blank' rel='noreferrer'>
              {url}
            </a>
          </Container>}
          <Container style={{ wordBreak: 'break-word' }}>
            <Typography variant='body1'>
              {description}
            </Typography>
          </Container>
          <Container className={styles.utilsContainer}>
            <ProposalComments
              client={client}
              issueId={id}
              user={user}
              alreadyLogin={alreadyLogin}
              extraButtonSlot={<>
                <Button
                  className={styles.utilsButton}
                  variant="contained"
                  color={selfSupported ? 'secondary' : 'primary'}
                  startIcon={<ThumbUpIcon />}
                  onClick={toggleSelfSupportState}
                  disabled={toggling}
                  size='small'
                >
                  {selfSupported ? '取消支持' : '支持'}
                </Button>
                {alreadyLogin && user.id === proposalUser.id && <Button
                  className={styles.utilsButton}
                  variant="contained"
                  color="primary"
                  startIcon={<DeleteIcon />}
                  onClick={removeThisProposal}
                  disabled={removing}
                  size="small"
                >
                  删除
                </Button>}
              </>}
            ></ProposalComments>
          </Container>
        </Container>
      </AccordionDetails>
    </Accordion>
  </div>
}

export default ProposalCard
