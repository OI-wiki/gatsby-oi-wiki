// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Avatar, Button, CircularProgress, Container, createStyles, Divider, Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionClient } from './CollectionClient'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionUser, ProposalComment } from './types'
import { Pagination } from '@material-ui/lab'
import AddCommentDialog from './AddCommentDialog'
import { Add as AddIcon } from '@material-ui/icons'
import { DateTime } from 'luxon'
interface ProposalCommentsProps {
  issueId: number;
  client: CollectionClient;
  user: CollectionUser;
  extraButtonSlot: React.ReactNode;
  alreadyLogin: boolean;
}
const COMMENTS_PER_PAGE = 5
const useStyles = makeStyles((theme: Theme) => createStyles({
  pagination: {
    marginTop: theme.spacing(1),
  },
  commentItem: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  utilsContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(0),
  },
  headerTop: {
    marginTop: theme.spacing(2),
  },
  utilsButton: {
    marginRight: theme.spacing(1),
  },
}))
const ProposalComments: React.FC<ProposalCommentsProps> = (props) => {
  const styles = useStyles()
  const {
    issueId,
    client,
    user,
    extraButtonSlot,
    alreadyLogin,
  } = props
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ProposalComment[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(-1)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const loadPage = async (page: number): Promise<void> => {
    // -1表示加载最后一页
    setLoading(true)
    const commentCount = await client.getIssueCommentCount(issueId)
    const pages = Math.ceil(commentCount / COMMENTS_PER_PAGE)
    if (page === -1) page = pages
    const resp = await client.getComments(issueId, page, COMMENTS_PER_PAGE)
    console.debug('Loaded comments for issueId ', issueId, resp)
    setData(resp)
    setPageCount(pages)
    setPage(page)
    setLoading(false)
    setLoaded(true)
  }
  useEffect(() => {
    if (!loaded) loadPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])
  useEffect(() => {
    setLoaded(false)
  }, [issueId])
  return <>
    {alreadyLogin && <>
      <Container className={styles.utilsContainer}>
        <>
          {extraButtonSlot}
          <Button
            className={styles.utilsButton}
            variant="contained"
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
            size='small'
          >
            添加评论
          </Button>
        </>
      </Container>
    </>}
    <Typography className={styles.headerTop} variant='h6'>
      评论
    </Typography>
    <Divider></Divider>

    {loading && <Grid container justifyContent='center'>
      <Grid item>
        <CircularProgress color='inherit' />
      </Grid>
    </Grid>}
    {loaded && <>
      {pageCount === 0
        ? <>
          <Grid container justifyContent='center'>
            <Grid item>
              <Typography>暂无评论...</Typography>
            </Grid>
          </Grid>
        </>
        : <>
          {data.map((x, i) => <div key={x.node_id}>
            <Grid container className={styles.commentItem}>
              <Grid item xs={2}>
                <Avatar alt={x.user.login} sizes='20px' src={x.user.avatar_url}></Avatar>
              </Grid>
              <Grid item xs={10}>
                <Grid spacing={2} container>
                  <Grid xs={6} item>
                    <Typography variant='caption'>
                      <a href={x.user.html_url}>{x.user.login}</a>
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography style={{ fontSize: '3px', color: 'grey' }} variant='caption'>
                      {DateTime.fromISO(x.created_at).toJSDate().toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant='body1'>
                  {x.body}
                </Typography>
              </Grid>
            </Grid>
            <Divider></Divider>
          </div>)}
          <Grid container justifyContent='center'>
            <Grid item>
              <Pagination
                disabled={loading}
                count={pageCount}
                page={page}
                onChange={(_, p) => loadPage(p)}
                className={styles.pagination}
              ></Pagination>
            </Grid>
          </Grid>
        </>}
    </>}
    {showAddDialog && <AddCommentDialog
      client={client}
      finishCallback={() => loadPage(-1)}
      onClose={() => setShowAddDialog(false)}
      issueId={issueId}
      open={showAddDialog}
      user={user}
    ></AddCommentDialog>}
  </>
}

export default ProposalComments
