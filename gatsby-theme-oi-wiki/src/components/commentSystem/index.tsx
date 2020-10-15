import React, { useState, useEffect } from 'react'
import { Divider, Typography, makeStyles, Tooltip, Button, CircularProgress } from '@material-ui/core'
import GithubV3 from '@mgtd/vssue-api-github-v3'
import GithubV4 from '@mgtd/vssue-api-github-v4'
import createPersistedState from 'use-persisted-state'
import CommentCard from './CommentCard'
import CommentInput from './CommentInput'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Comments, Issue, User } from './types'
import { InputContentProvider } from './inputContext'
const useToken = createPersistedState('github-access-token')

interface Props {
  clientID: string,
  clientSecret: string,
  repo: string,
  owner: string,
  admin: Array<string>,
  id: string,
}

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.primary,
  },
}))

async function getComments (ghAPIV3: GithubV3, ghAPIV4: GithubV4, id: string, revokeToken: () => void, token?: string): Promise<[Issue, Comments] | 'noIssue' | 'invalidToken'> {
  let issue: Issue
  try {
    issue = await ghAPIV3.getIssue({ accessToken: token, issueTitle: id })
  } catch (e) {
    revokeToken()
    return 'invalidToken'
  }
  if (issue === null) {
    return 'noIssue'
  }
  let comments: Comments
  if (!token) {
    comments = await ghAPIV3.getComments({ accessToken: token, issueId: issue.id, query: { page: 1, perPage: 100 } })
  } else {
    comments = await ghAPIV4.getComments({ accessToken: token, issueId: issue.id, query: { page: 1, perPage: 100, sort: 'asce' } })
  }
  return [issue, comments]
}

const CommentSystem: React.FC<Props> = (props) => {
  const classes = useStyles()
  const defaultUser = { username: '未登录用户', avatar: undefined, homepage: undefined }
  const [token, setToken] = useToken(null)
  const revokeToken = (): void => {
    setToken(null)
    setUser(defaultUser)
  }
  const [user, setUser] = useState<User>(defaultUser)
  const [comments, setComments] = useState<Comments>({ count: 0, page: 0, perPage: 0, data: [] })
  const [noIssue, setNoIssue] = useState(false)
  const filteredComments = comments.data.filter(({ isMinimized }) => !isMinimized)
  const [issue, setIssue] = useState<Issue>()
  const [createIssueLoading, setCreateIssueLoading] = useState(false)
  const isDisabled = user.username === '未登录用户' || !token || noIssue
  const isAdmin = props.admin.indexOf(user.username) >= 0
  const ghAPIV3 = new GithubV3(
    {
      baseURL: 'https://github.com',
      owner: props.owner,
      repo: props.repo,
      labels: ['gitalk'],
      clientId: props.clientID,
      clientSecret: props.clientSecret,
      state: '123',
      proxy: url => `https://cors-anywhere.herokuapp.com/${url}`,
    })
  const ghAPIV4 = new GithubV4(
    {
      baseURL: 'https://github.com',
      owner: props.owner,
      repo: props.repo,
      labels: ['gitalk'],
      clientId: props.clientID,
      clientSecret: props.clientSecret,
      state: '123',
      proxy: url => `https://cors-anywhere.herokuapp.com/${url}`,
    })
  useEffect(() => {
    const asyncFunc = async (): Promise<void> => {
      let tk = token
      if (!tk) {
        tk = await ghAPIV3.handleAuth()
        if (tk !== null) {
          setToken(tk)
        }
      }
      const tmp = await getComments(ghAPIV3, ghAPIV4, props.id, revokeToken, tk)
      if (tmp === 'noIssue') {
        setNoIssue(true)
      } else if (tmp !== 'invalidToken') {
        const [i, c] = tmp
        setComments(c)
        setIssue(i)
      }
      const u: User = await ghAPIV3.getUser({ accessToken: tk })
      setUser(u)
    }

    asyncFunc().catch(reject => {
      console.log(reject)
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clientID, props.clientSecret, props.id])
  const updateComments = async (): Promise<void> => {
    const tmp = await getComments(ghAPIV3, ghAPIV4, props.id, revokeToken, token)
    if (tmp !== 'invalidToken' && tmp !== 'noIssue') {
      const [, c] = tmp
      setComments(c)
    }
  }
  const NoIssueComponent = (): React.ReactElement => {
    return isAdmin
      ? <Typography variant="body1" style={{ padding: '24px', textAlign: 'center' }}>
        <Button variant="outlined" color="primary" disabled={createIssueLoading}
          onClick={async () => {
            setCreateIssueLoading(true)
            await ghAPIV4.postIssue({ accessToken: token, title: props.id, content: location.href })
            // sleep 1s, 直接查询会返回无结果，迷惑
            await new Promise(resolve => setTimeout(resolve, 1000))
            const tmp = await getComments(ghAPIV3, ghAPIV4, props.id, revokeToken, token)
            setCreateIssueLoading(false)
            if (tmp !== 'invalidToken' && tmp !== 'noIssue') {
              const [i, c] = tmp
              setNoIssue(false)
              setComments(c)
              setIssue(i)
            }
          }}>
          为本页面创建 Issue
          {createIssueLoading && <CircularProgress size={20} style={{ marginLeft: '4px' }} />}
        </Button>
      </Typography>
      : <Typography variant="body1" style={{ padding: '24px', textAlign: 'center' }}>
        没有找到与本页面相关联的 issue
      </Typography>
  }
  return <InputContentProvider>
    <Typography variant="h6" >
      <Tooltip title="在 GitHub 上查看">
        <a href={issue?.link} className={classes.link}>{`${filteredComments.length} 条评论`}</a>
      </Tooltip>
      <Tooltip title={ isDisabled ? '登录' : '登出'}>
        <div style={{ float: 'right', cursor: 'pointer' }} onClick={() => {
          if (!token) {
            ghAPIV3.redirectAuth()
          } else {
            setToken(null)
            setUser(defaultUser)
          }
        }}>
          {user.username}
        </div>
      </Tooltip>

    </Typography>
    <Divider/>
    <CommentInput
      name={user.username}
      avatarLink={user.avatar}
      disabled={isDisabled}
      showLogin={token === null}
      handleLogin={() => {
        ghAPIV3.redirectAuth()
      }}
      sendComment={async (v, setLoading) => {
        setLoading(true)
        try {
          await ghAPIV3.postComment({ accessToken: token, issueId: issue.id, content: v })
        } catch (e) {
          setLoading(false)
          return
        }
        updateComments()
        setLoading(false)
      }} />
    {noIssue
      ? <NoIssueComponent/>
      : filteredComments.map(
        ({ content, author, createdAt, reactions, id, contentRaw }) =>
          (
            <CommentCard
              avatarLink={author.avatar}
              disabled={isDisabled}
              name={author.username}
              contentHTML={content}
              contentRaw={contentRaw}
              time={createdAt}
              key={id}
              reactions={reactions}
              currentUser={user}
              commentID={id}
              deleteComment={async (commentId, setDeleteLoading) => {
                setDeleteLoading(true)
                await ghAPIV4.deleteComment({ accessToken: token, commentId, issueId: issue.id })
                updateComments()
                setDeleteLoading(false)
              }}
              addReaction={async (commentId, reaction) => {
                await ghAPIV4.postCommentReaction({ accessToken: token, commentId, reaction, issueId: issue.id })
              }}
              removeReaction={async (commentId, reaction) => {
                await ghAPIV4.deleteCommentReaction({ accessToken: token, commentId, reaction, issueId: issue.id })
              }}
            />
          ))
    }
  </InputContentProvider>
}

export default CommentSystem
