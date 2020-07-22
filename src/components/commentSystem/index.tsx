import React, { useState, useEffect } from 'react'
import { Divider, Typography } from '@material-ui/core'
import GithubV3 from '@vssue/api-github-v3'
import createPersistedState from 'use-persisted-state'
import CommentCard from './CommentCard'
import CommentInput from './CommentInput'

const useToken = createPersistedState('github-access-token')

interface Props {
  clientID: string,
  clientSecret: string,
  repo: string,
  owner: string,
  admin: Array<string>,
  id: string,
}

interface User {
  avatar: string,
  homepage: string,
  username: string
}

interface Issue {
  id: string,
  title: string,
  content: string,
  link: string
}

interface Reactions {
  like?: number
  unlike?: number
  heart?: number
}
interface SingleComment {
  id: string
  content: string
  contentRaw: string
  author: User
  createdAt: string
  updatedAt: string
  reactions?: Reactions | null
}
interface Comments {
  count: number
  page: number
  perPage: number
  data: Array<SingleComment>
}

const mockData = [{
  avatarLink: 'https://avatars3.githubusercontent.com/u/25521218?s=60&v=4',
  name: 'mgt',
  contentHTML: `
          <p>可能不工作，不过 CI 大概不需要在 Windows 上跑？我也感觉这样做有一点点丑，但是 gatsby 文档中给出的 .env.production 文件，似乎并不在配置文件里面生效，于是就采用了这种方法。</p>
<p>不知道有没有更好看的写法，印象里面有的 CI 是可以在配置里面加入环境变量的</p>

`,
  timestamp: +new Date(),
}, {
  avatarLink: 'https://avatars0.githubusercontent.com/u/13145192?s=60&u=9c13097c150fba83141b29eb6905e51c1a8419b0&v=4',
  name: 'diauweb',
  timestamp: 1272737372,
  contentHTML: `<div class="comment-body markdown-body soft-wrap  js-comment-body">
            <p><code>optionalDependencies</code> may help<br>
and who may have problems in internet connection can simply <code>npm install --no-optional</code></p>
          </div>`,
}]

const CommentSystem: React.FC<Props> = (props) => {
  const commentCount = 2
  const [token, setToken] = useToken(null)
  const [user, setUser] = useState<User>({ username: '未登录用户', avatar: undefined, homepage: undefined })
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
      if (!token) {
        const tk = await ghAPI.handleAuth()
        if (tk !== null) {
          setToken(tk)
        }
      }
      const u: User = await ghAPI.getUser({ accessToken: token })
      setUser(u)
      const c: Issue = await ghAPI.getIssue({ accessToken: undefined, issueTitle: props.id })
      const r: Comments = await ghAPI.getComments({ accessToken: undefined, issueId: c.id, query: { page: 0, perPage: 100 } })
      console.log(r)
    }
    asyncFunc()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clientID, props.clientSecret, props.id])

  return <>
    <Typography variant="h6" >
      {`${commentCount} 条评论`}
      <div style={{ float: 'right' }} onClick={() => {
        if (!token) {
          ghAPI.redirectAuth()
        }
      }}>
        {user.username}
      </div>
    </Typography>
    <Divider/>
    <CommentInput name={user.username} avatarLink={user.avatar} sendComment={(v) => { console.log(v) }} disabled={isDisabled}/>
    {mockData.map(v => <CommentCard key={+v.timestamp} {...v} />)}
  </>
}

export default CommentSystem
