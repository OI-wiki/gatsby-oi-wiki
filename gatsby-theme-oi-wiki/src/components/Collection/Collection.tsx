// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Avatar, Button, CircularProgress, createStyles, Divider, FormControl, Grid, GridSize, Hidden, InputLabel, makeStyles, MenuItem, Select, Theme, Tooltip, Typography } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import GithubV4 from '@mgtd/vssue-api-github-v4'
import React, { useState, useEffect } from 'react'
import createPersistedState from 'use-persisted-state'
import { CollectionClient } from './CollectionClient'
import DetailInputDialog from './DetailInputDialog'
import ProposalCard from './ProposalCard'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionItem, CollectionUser, SortMethod } from './types'

const useToken = createPersistedState('github-access-token')
const useItemsPerPage = createPersistedState('collection-items-per-page')
const usePreferredSortMethod = createPersistedState('collection-preferred-sort-method')
const REPO_OWNER = process.env.GATSBY_GITHUB_COLLECTION_REPO_OWNER || 'officeyutong'
const REPO_NAME = process.env.GATSBY_GITHUB_COLLECTION_REPO_NAME || 'collection-test'
const PROYX_URL = process.env.GATSBY_GITHUB_COLLECTION_PROXYURL || 'https://sparkling-silence-bf63.officeyutong.workers.dev/?'
const apiClient = new GithubV4({
  baseURL: 'https://github.com',
  owner: REPO_OWNER,
  repo: REPO_NAME,
  // 使用和评论区相同的OAuth App
  clientId: process.env.GATSBY_GITHUB_CLIENT_ID,
  clientSecret: process.env.GATSBY_GITHUB_CLIENT_SECRET,
  labels: [],
  proxy: (url: string) => `${PROYX_URL}${url}`,
})

const useStyles = makeStyles((theme: Theme) => createStyles({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  formControl: {
    width: '100%',
  },
  pagination: {
    paddingTop: theme.spacing(2),
  },
}))

// eslint-disable-next-line @typescript-eslint/ban-types
const Collection: React.FC<{ id: string }> = ({ id }) => {
  const styles = useStyles()
  const [token, setToken] = useToken<string | null>(null)
  const [data, setData] = useState<CollectionItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState<CollectionUser>({ login: false })
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [, setCount] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useItemsPerPage<number>(10)
  const [sortMethod0, setSortMethod] = usePreferredSortMethod<SortMethod>('support')
  const [contentLoading, setContentLoading] = useState(false)
  const [showDetailInput, setShowDetailInput] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const login = user.login
  const client = new CollectionClient(token, REPO_OWNER, REPO_NAME)
  const sortMethod: SortMethod = React.useMemo(() => {
    if (sortMethod0 === 'comment' || sortMethod0 === 'support') return sortMethod0
    return 'support'
  }, [sortMethod0])
  const revokeToken = (): void => {
    setToken(null)
    setUser({ login: false })
  }
  const loadPage = async (page: number): Promise<void> => {
    setContentLoading(true)
    const resp = await client.getCollection(id, page, itemsPerPage, sortMethod)
    setContentLoading(false)
    setPage(page)
    setPageCount(resp.totalPage)
    setCount(resp.proposalCount)
    setData(resp.data)
    setLoaded(true)
  }
  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const { username, avatar, homepage } = await apiClient.getUser({ accessToken: token })
          const resp = await client.getUserDetails(username)
          setUser({
            login: true,
            avatar: avatar as string,
            homepage: homepage as string,
            id: resp.id,
            node_id: resp.node_id,
            username: username,
          })
          // console.log(resp)
        } catch (e) {
          revokeToken()
          // return
        }
      } else {
        const token = await apiClient.handleAuth()
        console.log('token=', token)
        setToken(token)
      }
      // await loadPage(1)
      // setLoaded(true)
      setShouldLoad(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, token])
  useEffect(() => {
    if (shouldLoad) loadPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, sortMethod, shouldLoad])
  return <div>
    {!loaded
      ? <div>
        <Grid container justifyContent='center'>
          <Grid item>
            <CircularProgress color='inherit' />
          </Grid>
        </Grid>
      </div>
      : <div>
        <Grid spacing={2} container>
          {user.login && <Hidden smDown>
            <Grid item>
              <a href={user.homepage}>
                <Avatar alt={user.username} src={user.avatar}></Avatar>
              </a>
            </Grid>
          </Hidden>}
          <Grid item xs={(login ? 10 : 11) as GridSize}>
            {user.login
              ? <Tooltip title={user.username}>
                <Typography variant='h6'>
                  {user.username}
                </Typography>
              </Tooltip>
              : <Tooltip title='未登录'><Typography variant='h6'></Typography></Tooltip>}
          </Grid>
          <Grid item xs={1}>
            <div style={{ float: 'right' }}>
              <Button color='primary' variant='contained' onClick={() => (login ? revokeToken() : apiClient.redirectAuth())}>{login ? '登出' : '登录'}</Button>
            </div>
          </Grid>
        </Grid>
        <Divider className={styles.divider}></Divider>
        {contentLoading
          ? <div style={{ height: '100px' }}>
            <Grid container justifyContent='center'>
              <Grid item>
                <CircularProgress />
              </Grid>
            </Grid>
          </div>
          : <div>
            {data.map((x, i) => <ProposalCard
              key={x.name}
              commentCount={x.commentCount}
              description={x.description}
              id={x.id}
              name={x.name}
              nodeId={x.nodeId}
              supportCount={x.supportCount}
              url={x.url}
              client={client}
              sortMethod={sortMethod}
              user={user}
              proposalUser={x.user}
              updateSupportCount={v => {
                const newval = [...data]
                for (const val of newval) { if (val.id === x.id) { val.supportCount = v } }
                setData(newval)
              }}
              removeCallback={() => {
                setData(data.filter(y => y.id !== x.id))
              }}
            ></ProposalCard>)}
          </div>}
        <Divider className={styles.divider}></Divider>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <FormControl disabled={contentLoading} className={styles.formControl} >
              <InputLabel id='collection-sort-method-input-label'>排序方式</InputLabel>
              <Select
                label='排序方式'
                labelId='collection-sort-method-input-label'
                id='collection-sort-method-select'
                value={sortMethod}
                onChange={e => {
                  setSortMethod(e.target.value as SortMethod)
                }}
              >
                <MenuItem value={'support' as SortMethod}>支持数</MenuItem>
                <MenuItem value={'comment' as SortMethod}>评论数</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl disabled={contentLoading} className={styles.formControl} >
              <InputLabel id='collection-items-perpage-input-label'>每页条数</InputLabel>
              <Select
                fullWidth
                label='每页条数'
                labelId='collection-items-perpage-input-label'
                id='collection-items-perpage-select'
                value={itemsPerPage}
                onChange={e => setItemsPerPage(e.target.value as number)}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {pageCount >= 1 && <Grid container justifyContent='center'>
              <Grid item>
                <Pagination
                  disabled={contentLoading}
                  count={pageCount}
                  page={page}
                  onChange={(_, p) => loadPage(p)}
                  className={styles.pagination}
                ></Pagination>
              </Grid>
            </Grid>}
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            {login && <Button onClick={() => setShowDetailInput(true)} color='primary' variant='contained'>
              添加提案
            </Button>}
          </Grid>
        </Grid>
      </div>}
    {showDetailInput && <DetailInputDialog open onClose={() => setShowDetailInput(false)} finishCallback={() => loadPage(page)} client={client} pageId={id}></DetailInputDialog>}
  </div>
}

export default Collection
