import React, { useState } from 'react'
import { useInputContentContext } from './inputContentContext'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import { TextField } from '@mui/material'

interface CommentInputProps {
  avatarLink: string,
  name: string
  sendComment: (res: string, setLoading: (loading: boolean) => void) => Promise<void>,
  showLogin: boolean,
  handleLogin: () => void,
  authorized: boolean,
}

const StyledGrid = styled(Grid)(({ theme }) => css`
  margin-top: ${theme.spacing(1)};
`) as typeof Grid

const BtnWrapper = styled(Box)(({ theme }) => css`
  text-align: right;
  margin-bottom: ${theme.spacing(1)};
`)

const StyledBtn = styled(Button)(({ theme }) => css`
  margin-block: ${theme.spacing(1)};
`)

const CommentInput: React.FC<CommentInputProps> = (props) => {
  const { name, avatarLink, authorized } = props
  const { inputContent, setInputContent } = useInputContentContext()
  const [loading, setLoading] = useState(false)

  return (
    <>
      {loading && <LinearProgress/>}
      <StyledGrid container={true} spacing={2} justifyContent="center">
        <Grid item={true} sx={{ display: { sm: 'none', md: 'block' } }}>
          <Avatar alt={name} src={avatarLink}/>
        </Grid>
        <Grid item={true} xs={true}>
          <TextField
            placeholder="我们鼓励在讨论区讨论有意义的内容及关于文章的勘误，无意义的讨论将会被管理员删除"
            multiline={true}
            fullWidth={true}
            disabled={!authorized || loading}
            rows={5}
            value={inputContent}
            onChange={(e) => {
              setInputContent(e.target.value)
            }}
            variant="outlined"
          />
        </Grid>
      </StyledGrid>
      <BtnWrapper>
        <StyledBtn
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            if (props.showLogin) {
              props.handleLogin()
            } else {
              props.sendComment(inputContent, setLoading)
              setInputContent('')
            }
          }}>
          {props.showLogin ? '登录' : '评论'}
        </StyledBtn>
      </BtnWrapper>
    </>
  )
}

export default CommentInput
