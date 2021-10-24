import React, { useState } from 'react'
import { User } from '@mgtd/vssue-api-github-v4/lib/types'
import Time from '../../Time'
import { Reactions } from '../types'
import { useInputContentContext } from '../inputContentContext'
import ReactionButton, { ReactionButtonProps } from './ReactionButton'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { ArrayItemType } from '../../../types/common'
import Delete from '@mui/icons-material/Delete'
import Favorite from '@mui/icons-material/Favorite'
import Reply from '@mui/icons-material/Reply'
import ThumbDown from '@mui/icons-material/ThumbDown'
import ThumbUp from '@mui/icons-material/ThumbUp'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'

type ReactionUnion = ArrayItemType<Reactions>['type']

type BtnInfoObj = {
  [key in ReactionUnion]: Pick<ReactionButtonProps, 'icon' | 'iconClickedClassName'>
}

type ReactionObj = {
  [key in ReactionUnion]: ArrayItemType<Reactions>
}

export interface CommentCardProps {
  disabled: boolean,
  currentUser: User,
  commentID: string | number,
  avatarLink: string,
  name: string,
  contentHTML: string,
  contentRaw: string
  time: number | string | Date,
  reactions: Reactions,
  deleteComment: (commentID: string | number, setLoading: (loading: boolean) => void) => Promise<void>,
  addReaction: (commentID: string | number, reaction: ReactionUnion) => Promise<void>,
  removeReaction: (commentID: string | number, reaction: ReactionUnion) => Promise<void>
}

const StyledCard = styled(Card)(({ theme }) => css`
  margin-block: ${theme.spacing(1)};
`)

const StyledCardHeader = styled(CardHeader)(({ theme }) => css`
  padding: ${theme.spacing(2)} ${theme.spacing(2)} 0;
`)

const StyledCardContent = styled(CardContent)(({ theme }) => css`
  padding: 0 ${theme.spacing(2)};
`)

const btnInfoObj: BtnInfoObj = {
  like: {
    icon: ThumbUp,
    iconClickedClassName: 'yellow',
  },
  unlike: {
    icon: ThumbDown,
    iconClickedClassName: 'yellow',
  },
  heart: {
    icon: Favorite,
    iconClickedClassName: 'red',
  },
}

const CommentCard: React.FC<CommentCardProps> = (props) => {
  const { name, time, disabled, currentUser, reactions, commentID } = props
  const reactionObj: ReactionObj = {
    like: reactions.find(item => item.type === 'like') as ArrayItemType<Reactions>,
    unlike: reactions.find(item => item.type === 'unlike') as ArrayItemType<Reactions>,
    heart: reactions.find(item => item.type === 'heart') as ArrayItemType<Reactions>,
  }

  const [deleteLoading, setDeleteLoading] = useState(false)
  const { setInputContent } = useInputContentContext()

  return (
    <StyledCard variant="outlined">
      <StyledCardHeader
        subheader={<Time time={time}/>}
        avatar={<Avatar alt={name} src={props.avatarLink}/>}
        title={<>
          {props.name}
          {currentUser.username === props.name &&
          <IconButton
            disabled={disabled}
            size="small"
            aria-label="delete"
            sx={{ float: 'right' }}
            onClick={() => {
              props.deleteComment(commentID, setDeleteLoading)
            }}>
            {deleteLoading
              ? <CircularProgress size={20}/>
              : <Delete fontSize="small"/>}
          </IconButton>
          }
          <IconButton
            size="small"
            aria-label="reply"
            sx={{ float: 'right' }}
            onClick={() => {
              setInputContent(`> ${props.contentRaw}`)
            }}>
            <Reply fontSize="small"/>
          </IconButton>
        </>}
      />
      <StyledCardContent>
        <div dangerouslySetInnerHTML={{ __html: props.contentHTML }}/>
      </StyledCardContent>
      <CardActions>
        {
          Object.entries(reactionObj).map(([key, data]) => (
            <ReactionButton
              key={key}
              disabled={disabled}
              currentUser={currentUser}
              initialCount={data.count}
              isClicked={data.viewerHasReacted}
              addReaction={async () => {
                await props.addReaction(commentID, data.type)
              }}
              removeReaction={async () => {
                await props.removeReaction(commentID, data.type)
              }}
              users={data.users}
              {...btnInfoObj[data.type]}
            />
          ))
        }
      </CardActions>
    </StyledCard>)
}

export default CommentCard
