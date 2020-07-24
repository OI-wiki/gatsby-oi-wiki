import React, { useState, useEffect } from 'react'
import { Divider, Typography, makeStyles, Tooltip } from '@material-ui/core'
import GithubV3 from '@mgtd/vssue-api-github-v3'
import GithubV4 from '@mgtd/vssue-api-github-v4'
import createPersistedState from 'use-persisted-state'
import CommentCard from './CommentCard'
import CommentInput from './CommentInput'
import { Comments, Issue, User } from './types'
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

async function getComments (ghAPIV3: GithubV3, ghAPIV4: GithubV4, id: string, token?: string): Promise<[Issue, Comments] | null> {
  let issue: Issue
  try {
    issue = await ghAPIV3.getIssue({ accessToken: token, issueTitle: id })
  } catch (e) {
    return null
  }
  if (issue === null) {
    return null
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
  const [user, setUser] = useState<User>(defaultUser)
  const [comments, setComments] = useState<Comments>({ count: 0, page: 0, perPage: 0, data: [] })
  const [issue, setIssue] = useState<Issue>()
  const isDisabled = user.username === '未登录用户' || !token
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
      const tmp = await getComments(ghAPIV3, ghAPIV4, props.id, tk)
      if (tmp !== null) {
        const [i, c] = tmp
        setComments(c)
        setIssue(i)
      } else {
        setToken(null)
        setUser(defaultUser)
        return
      }
      const u: User = await ghAPIV3.getUser({ accessToken: tk })
      setUser(u)
    }
    asyncFunc()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clientID, props.clientSecret, props.id])
  const updateComments = async (): Promise<void> => {
    const tmp = await getComments(ghAPIV3, ghAPIV4, props.id, token)
    if (tmp !== null) {
      const [, c] = tmp
      setComments(c)
    }
  }
  return <>
    <Typography variant="h6" >
      <Tooltip title="在 GitHub 上查看">
        <a href={issue?.link} className={classes.link}>{`${comments.count} 条评论`}</a>
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
    <CommentInput name={user.username} avatarLink={user.avatar} disabled={isDisabled}
      sendComment={async (v, setLoading) => {
        setLoading(true)
        await ghAPIV3.postComment({ accessToken: token, issueId: issue.id, content: v })
        setLoading(false)
        updateComments()
      }} />
    {
      comments.data.map(
        ({ content, author, createdAt, reactions, id }) =>
          (
            <CommentCard
              avatarLink={author.avatar}
              disabled={isDisabled}
              name={author.username}
              contentHTML={content}
              time={createdAt}
              key={id}
              reactions={reactions}
              currentUser={user}
              commentID={id}
              deleteComment={async (commentId) => {
                const success: boolean = await ghAPIV3.deleteComment({ accessToken: token, commentId, issueId: issue.id })
                updateComments()
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
  </>
}

export default CommentSystem
