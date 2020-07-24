import { Avatar, Button, Card, CardActions, CardContent, CardHeader, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Red from '@material-ui/core/colors/red'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import clsx from 'clsx'
import { User } from '@mgtd/vssue-api-github-v4/lib/types'
import Time from '../Time'
import { Reactions } from './types'

interface Props {
  disabled: boolean,
  currentUser: User,
  commentID: string | number,
  avatarLink: string,
  name: string,
  contentHTML: string,
  time: number | string | Date,
  reactions: Reactions,
  deleteComment: (commentID: string | number) => Promise<void>,
  addReaction: (commentID: string | number, reaction: 'heart' | 'unlike' | 'like') => Promise<void>,
  removeReaction: (commentID: string | number, reaction: 'heart' | 'unlike' | 'like') => Promise<void>
}

const useStyles = makeStyles(theme => ({
  contentRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: '0px',
    paddingTop: '0px',
  },
  headerRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: '0px',
    paddingTop: theme.spacing(2),
  },
  commentMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  clickedBackground: {
    background: (theme.palette as unknown as any).reactionButtonBackground,
  },
  red: {
    color: Red[500],
  },
  yellow: {
    color: '#ffcf56',
  },
  nullReactionStartIcon: {
    marginLeft: '0px',
    marginRight: '0px',
  },
  nullReaction: {
    padding: '5px 10px',
  },
  reactionButton: {
    minWidth: '0px',
  },
  labelMargin: {
    marginLeft: '1.5px',
  },
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const reactionButtonDefaultProps = {
  initialCount: 0,
  isClicked: false,
}
type ReactionButtonProps = {
  text: any,
  disabled: boolean
  currentUser: User
  addReaction: () => void,
  removeReaction: () => void,
  users: User[],
} & Partial<typeof reactionButtonDefaultProps>

const ReactionButton: React.FC<ReactionButtonProps> = (props) => {
  const classes = useStyles()
  const propsMerged = { ...reactionButtonDefaultProps, ...props }
  const [isClicked, setIsClicked] = useState(propsMerged.isClicked)
  const [count, setCount] = useState(propsMerged.initialCount)
  const [users, setUsers] = useState(propsMerged.users)
  const clickFunc = (): void => {
    if (isClicked) {
      setCount(count - 1)
      propsMerged.removeReaction()
      const tmpUsers = users.filter(({ username }) => username !== propsMerged.currentUser.username)
      setUsers(tmpUsers)
    } else {
      setCount(count + 1)
      propsMerged.addReaction()
      const tmpUsers: User[] = [...users, propsMerged.currentUser]
      setUsers(tmpUsers)
    }
    setIsClicked(!isClicked)
  }
  return (
    <Button
      color="default"
      variant="outlined"
      size="small"
      disabled={propsMerged.disabled}
      startIcon={propsMerged.text}
      className={clsx(isClicked && classes.clickedBackground, count === 0 && classes.nullReaction, classes.reactionButton)}
      onClick={clickFunc}
      classes={ count === 0 ? { startIcon: classes.nullReactionStartIcon, label: classes.labelMargin } : undefined}
    >
      {count !== 0 && count}
      <AvatarGroup max={3} style={{ marginLeft: '4px' }}>
        {users.map(({ avatar, username }) => (
          <Avatar alt={username} src={avatar} key={username} className={classes.avatarSmall}/>
        ))}
      </AvatarGroup>
    </Button>
  )
}

const CommentCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const like = props.reactions.find(item => item.type === 'like')
  const unlike = props.reactions.find(item => item.type === 'unlike')
  const heart = props.reactions.find(item => item.type === 'heart')
  return (
    <Card variant="outlined" className={classes.commentMargin}>
      <CardHeader
        avatar={<Avatar alt={props.name} src={props.avatarLink}/>}
        title={<>
          {props.name} { props.currentUser.username === props.name &&
            <IconButton disabled={props.disabled} size="small" aria-label="delete" style={{ float: 'right' }} onClick={() => { props.deleteComment(props.commentID) }}>
              <DeleteIcon />
            </IconButton>}
        </>}
        classes={{ root: classes.headerRoot }}
        subheader={<Time time={props.time} />} />
      <CardContent classes={{ root: classes.contentRoot }}>
        <div dangerouslySetInnerHTML={{ __html: props.contentHTML }}/>
      </CardContent>
      <CardActions>
        <ReactionButton
          text={<ThumbUpIcon className={classes.yellow} />}
          disabled={props.disabled}
          currentUser={props.currentUser}
          initialCount={like.count}
          isClicked={like.viewerHasReacted}
          addReaction={() => { props.addReaction(props.commentID, 'like') }}
          removeReaction={() => { props.removeReaction(props.commentID, 'like') }}
          users={like.users}
        />
        <ReactionButton
          text={<ThumbDownIcon className={classes.yellow}/>}
          disabled={props.disabled}
          currentUser={props.currentUser}
          initialCount={unlike.count}
          isClicked={unlike.viewerHasReacted}
          addReaction={() => { props.addReaction(props.commentID, 'unlike') }}
          removeReaction={() => { props.removeReaction(props.commentID, 'unlike') }}
          users={unlike.users}
        />
        <ReactionButton
          text={<FavoriteIcon className={classes.red}/>}
          disabled={props.disabled}
          currentUser={props.currentUser}
          initialCount={heart.count}
          isClicked={heart.viewerHasReacted}
          addReaction={() => { props.addReaction(props.commentID, 'heart') }}
          removeReaction={() => { props.removeReaction(props.commentID, 'heart') }}
          users={heart.users}
        />
      </CardActions>
    </Card>)
}

export default CommentCard
