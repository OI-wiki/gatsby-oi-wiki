import { Avatar, Button, Card, CardActions, CardContent, CardHeader, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Red from '@material-ui/core/colors/red'
import clsx from 'clsx'
import Time from '../Time'
import { Reactions } from './types'

interface Props {
  currentUser: string,
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
}))

const reactionButtonDefaultProps = {
  initialCount: 0,
  isClicked: false,
}
type ReactionButtonProps = {
  text: any,
  addReaction: () => void,
  removeReaction: () => void
} & Partial<typeof reactionButtonDefaultProps>

const ReactionButton: React.FC<ReactionButtonProps> = (props) => {
  const classes = useStyles()
  const propsMerged = { ...reactionButtonDefaultProps, ...props }
  const [isClicked, setIsClicked] = useState(propsMerged.isClicked)
  const [count, setCount] = useState(propsMerged.initialCount)
  const clickFunc = (): void => {
    if (isClicked) {
      setCount(count - 1)
      propsMerged.removeReaction()
    } else {
      setCount(count + 1)
      propsMerged.addReaction()
    }
    setIsClicked(!isClicked)
  }
  return (
    <Button
      color="default"
      variant="outlined"
      size="small"
      startIcon={props.text}
      className={clsx(isClicked && classes.clickedBackground, count === 0 && classes.nullReaction, classes.reactionButton)}
      onClick={clickFunc}
      classes={ count === 0 ? { startIcon: classes.nullReactionStartIcon, label: classes.labelMargin } : undefined}
    >
      {count !== 0 && count}
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
          {props.name} { props.currentUser === props.name &&
            <IconButton size="small" aria-label="delete" style={{ float: 'right' }} onClick={() => { props.deleteComment(props.commentID) }}>
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
          text={<ThumbUpIcon className={classes.yellow}/>}
          initialCount={like.count}
          isClicked={like.viewerHasReacted}
          addReaction={() => { props.addReaction(props.commentID, 'like') }}
          removeReaction={() => { props.removeReaction(props.commentID, 'like') }}
        />
        <ReactionButton
          text={<ThumbDownIcon className={classes.yellow}/>}
          initialCount={unlike.count}
          isClicked={unlike.viewerHasReacted}
          addReaction={() => { props.addReaction(props.commentID, 'unlike') }}
          removeReaction={() => { props.removeReaction(props.commentID, 'unlike') }}
        />
        <ReactionButton
          text={<FavoriteIcon className={classes.red}/>}
          initialCount={heart.count}
          isClicked={heart.viewerHasReacted}
          addReaction={() => { props.addReaction(props.commentID, 'heart') }}
          removeReaction={() => { props.removeReaction(props.commentID, 'heart') }}
        />
      </CardActions>
    </Card>)
}

export default CommentCard
