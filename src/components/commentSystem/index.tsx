import React, { useState, useEffect } from 'react'
import { Divider, Typography } from '@material-ui/core'
import GithubV3 from '@vssue/api-github-v3'
import createPersistedState from 'use-persisted-state'
import CommentCard from './CommentCard'
import CommentInput from './CommentInput'
import { Comments, Issue, User, SingleComment } from './types'
const useToken = createPersistedState('github-access-token')

interface Props {
  clientID: string,
  clientSecret: string,
  repo: string,
  owner: string,
  admin: Array<string>,
  id: string,
}

async function getComments (ghAPI: GithubV3, id: string, token?: string): Promise<[Issue, Comments] | null> {
  const issue: Issue = await ghAPI.getIssue({ accessToken: token, issueTitle: id })
  if (issue === null) {
    return null
  }
  const comments: Comments = await ghAPI.getComments({ accessToken: token, issueId: issue.id, query: { page: 0, perPage: 100 } })
  return [issue, comments]
}

const CommentSystem: React.FC<Props> = (props) => {
  const [token, setToken] = useToken(null)
  const [user, setUser] = useState<User>({ username: '未登录用户', avatar: undefined, homepage: undefined })
  const [comments, setComments] = useState<Comments>({ count: 0, page: 0, perPage: 0, data: [] })
  const [issue, setIssue] = useState<Issue>()
  const isDisabled = user.username === '未登录用户' || !token
  const ghAPI = new GithubV3(
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
      const tmp = await getComments(ghAPI, props.id, token)
      if (tmp !== null) {
        const [i, c] = tmp
        setComments(c)
        setIssue(i)
      }
      if (!token) {
        const tk = await ghAPI.handleAuth()
        if (tk !== null) {
          setToken(tk)
        }
      }
      const u: User = await ghAPI.getUser({ accessToken: token })
      setUser(u)
    }
    asyncFunc()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clientID, props.clientSecret, props.id])

  return <>
    <Typography variant="h6" >
      {`${comments.count} 条评论`}
      <div style={{ float: 'right' }} onClick={() => {
        if (!token) {
          ghAPI.redirectAuth()
        }
      }}>
        {user.username}
      </div>
    </Typography>
    <Divider/>
    <CommentInput name={user.username} avatarLink={user.avatar} disabled={isDisabled}
      sendComment={async (v) => {
        await ghAPI.postComment({ accessToken: token, issueId: issue.id, content: v })
        const tmp = await getComments(ghAPI, props.id, token)
        if (tmp !== null) {
          const [, c] = tmp
          setComments(c)
        }
      }} />
    {
      comments.data.map(
        ({ content, author, createdAt, reactions, id }) =>
          (
            <CommentCard
              avatarLink={author.avatar}
              name={author.username}
              contentHTML={content}
              timestamp={+new Date(createdAt)}
              key={id}
              reactions={reactions}
            />
          ))
    }
  </>
}

export default CommentSystem
