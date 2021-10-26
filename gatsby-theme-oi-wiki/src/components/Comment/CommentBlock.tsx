import React, { useEffect, useState } from 'react'
import CommentCard from './Card'
import CommentInput from './CommentInput'
import { InputContentProvider } from './inputContentContext'
import styled from '@mui/material/styles/styled'
import SmartLink from '../SmartLink'
import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react-lite'
import { commentStore } from './store'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import { useLocation } from '@reach/router'
import { computed } from 'mobx'


const StyledLink = styled(SmartLink)(({ theme }) => css`
  color: ${theme.palette.text.primary};
`)

const StyledTyp = styled(Typography)`
  padding: 24px;
  text-align: center;
`

const GithubLink: React.FC = observer(() => {
  return (
    <Tooltip title="在 GitHub 上查看">
      <StyledLink href={commentStore.issue?.link}>{`${commentStore.filteredCommentsData.length} 条评论`}</StyledLink>
    </Tooltip>
  )
})

const LoginBlock: React.FC = observer(() => {
  return (
    <Tooltip title={commentStore.authorized ? '登出' : '登录'}>
      <Box
        sx={{ float: 'right', cursor: 'pointer' }}
        onClick={() => {
          if (commentStore.token) {
            commentStore.setToken(null)
            commentStore.resetUser()
          } else {
            commentStore.ghApiV3.redirectAuth()
          }
        }}
      >
        {commentStore.user.username}
      </Box>
    </Tooltip>
  )
})

interface NoIssueBlockProps {
  id: string;
  admin: Array<string>;
}

const NoIssueBlock: React.FC<NoIssueBlockProps> = (props) => {
  const { admin, id } = props
  const isAdmin = computed(() => admin.includes(commentStore.user.username)).get()
  const [createIssueLoading, setCreateIssueLoading] = useState(false)
  const { href } = useLocation()

  return isAdmin
    ? <StyledTyp variant="body1">
      <Button
        variant="outlined"
        color="primary"
        disabled={createIssueLoading}
        onClick={async () => {
          setCreateIssueLoading(true)
          await commentStore.ghApiV4.postIssue({ accessToken: commentStore.token, title: id, content: href })
          // sleep 1s, 直接查询会返回无结果，迷惑
          await new Promise(resolve => setTimeout(resolve, 1000))
          const tmp = await commentStore.getComments(id)
          setCreateIssueLoading(false)
          if (tmp !== 'invalidToken' && tmp !== 'noIssue') {
            const [i, c] = tmp
            commentStore.setComments(c)
            commentStore.setIssue(i)
          }
        }}>
        为本页面创建 Issue
        {createIssueLoading && <CircularProgress size={20} sx={{ ml: 4 }}/>}
      </Button>
    </StyledTyp>
    : <StyledTyp variant="body1">
      没有找到与本页面相关联的 issue
    </StyledTyp>
}

interface CommentListProps {
  id: string;
}

const CommentList: React.FC<CommentListProps> = observer((props) => {
  const { id: issueTitle } = props

  const issueId = computed(() => commentStore.issue?.id || '').get()
  return (
    <>
      {commentStore.filteredCommentsData.map(({ content, author, createdAt, reactions, id, contentRaw }) => (
        <CommentCard
          avatarLink={author.avatar || ''}
          disabled={!commentStore.authorized}
          name={author.username}
          contentHTML={content}
          contentRaw={contentRaw}
          time={createdAt}
          key={id}
          reactions={reactions || []}
          currentUser={commentStore.user}
          commentID={id}
          deleteComment={async (commentId, setDeleteLoading) => {
            setDeleteLoading(true)
            await commentStore.ghApiV4.deleteComment({ accessToken: commentStore.token, commentId, issueId })
            await commentStore.updateComments(issueTitle)
            setDeleteLoading(false)
          }}
          addReaction={async (commentId, reaction) => {
            await commentStore.ghApiV4.postCommentReaction({
              accessToken: commentStore.token,
              commentId,
              reaction,
              issueId,
            })
          }}
          removeReaction={async (commentId, reaction) => {
            await commentStore.ghApiV4.deleteCommentReaction({
              accessToken: commentStore.token,
              commentId,
              reaction,
              issueId,
            })
          }}
        />
      ))}
    </>
  )
})

export interface CommentBlockProps {
  clientID: string,
  clientSecret: string,
  repo: string,
  owner: string,
  admin: Array<string>,
  id: string,
}

const CommentBlock: React.FC<CommentBlockProps> = observer((props) => {
  const { owner, repo, clientID, clientSecret, admin, id } = props

  useEffect(() => {
    commentStore.createApiInfo({
      owner,
      repo,
      clientSecret,
      clientId: clientID,
    })
  }, [clientID, clientSecret, owner, repo])


  useEffect(() => {
    const asyncFunc = async (): Promise<void> => {
      if (!commentStore.token) {
        await commentStore.ghApiV3.handleAuth().then((v) => {
          if (v !== null) {
            commentStore.setToken(v)
          }
        })
      }

      const res = await commentStore.getComments(id)
      if (res !== 'invalidToken' && res !== 'noIssue') {
        const [issue, comments] = res
        commentStore.setComments(comments)
        commentStore.setIssue(issue)
      }

      commentStore.setUser(
        await commentStore.ghApiV3.getUser({ accessToken: commentStore.token }),
      )
    }

    asyncFunc().catch(reject => {
      console.log(reject)
    })

  }, [id])

  return (
    <InputContentProvider>
      <Typography variant="h6">
        <GithubLink/>
        <LoginBlock/>
      </Typography>
      <Divider/>
      <CommentInput
        name={commentStore.user.username}
        avatarLink={commentStore.user.avatar || ''}
        authorized={commentStore.authorized}
        showLogin={commentStore.token === null}
        handleLogin={() => {
          commentStore.ghApiV3.redirectAuth()
        }}
        sendComment={async (v, setLoading) => {
          setLoading(true)
          await commentStore.ghApiV3.postComment({
            accessToken: commentStore.token,
            issueId: commentStore.issue?.id || '',
            content: v,
          })
            .then(() => {
              commentStore.updateComments(id)
            })
            .finally(() => {
              setLoading(false)
            })
        }}
      />
      {commentStore.noIssue
        ? <NoIssueBlock admin={admin} id={id}/>
        : <CommentList id={id}/>
      }
    </InputContentProvider>
  )
})

export default CommentBlock
