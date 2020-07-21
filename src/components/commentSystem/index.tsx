import React from 'react'
import { Divider, Typography } from '@material-ui/core'
import CommentCard from './CommentCard'
import CommentInput from './CommentInput'
interface Props {
  clientID: string,
  clientSecret: string,
  repo: string,
  owner: string,
  admin: Array<string>,
  id: string,
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
  timestamp: +new Date(),
  contentHTML: `<div class="comment-body markdown-body soft-wrap  js-comment-body">
            <p><code>optionalDependencies</code> may help<br>
and who may have problems in internet connection can simply <code>npm install --no-optional</code></p>
          </div>`,
}]

const CommentSystem: React.FC<Props> = (_props) => {
  const commentCount = 2
  return <>
    <Typography variant="h6">
      {`${commentCount} 条评论`}
      <div style={{ float: 'right' }}>
        登录
      </div>
    </Typography>
    <Divider/>
    <CommentInput name="mgt" avatarLink="https://avatars3.githubusercontent.com/u/25521218?s=60&v=4" sendComment={(v) => { console.log(v) }} />
    {mockData.map(v => <CommentCard key={+v.timestamp} {...v} />)}
  </>
}

export default CommentSystem
