import { Avatar, Button, Card, CardActions, CardContent, CardHeader, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Red from '@material-ui/core/colors/red'
import clsx from 'clsx'
import Time from '../Time'
import { Reactions } from './types'

interface Props {
  avatarLink: string,
  name: string,
  contentHTML: string,
  timestamp: number,
  reactions: Reactions
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
}))

const reactionButtonDefaultProps = {
  initialCount: 0,
  isClicked: false,
}
type ReactionButtonProps = {
  text: any,
  sendReaction: () => void,
} & Partial<typeof reactionButtonDefaultProps>

const ReactionButton: React.FC<ReactionButtonProps> = (props) => {
  const classes = useStyles()
  const propsMerged = { ...reactionButtonDefaultProps, ...props }
  const [isClicked, setIsClicked] = useState(propsMerged.isClicked)
  const [count, setCount] = useState(propsMerged.initialCount)
  const clickFunc = (): void => {
    if (isClicked) {
      setCount(count - 1)
    } else {
      setCount(count + 1)
    }
    setIsClicked(!isClicked)
    propsMerged.sendReaction()
  }
  return (
    <Button
      color="default"
      variant="outlined"
      size="small"
      startIcon={props.text}
      className={clsx(isClicked && classes.clickedBackground, count === 0 && classes.nullReaction, classes.reactionButton)}
      onClick={clickFunc}
      classes={ count === 0 ? { startIcon: classes.nullReactionStartIcon } : undefined}
    >
      {count !== 0 && count}
    </Button>
  )
}

const CommentCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  return (
    <Card variant="outlined" className={classes.commentMargin}>
      <CardHeader
        avatar={<Avatar alt={props.name} src={props.avatarLink}/>}
        title={props.name}
        classes={{ root: classes.headerRoot }}
        subheader={<Time timestamp={props.timestamp} />} />
      <CardContent classes={{ root: classes.contentRoot }}>
        <div dangerouslySetInnerHTML={{ __html: props.contentHTML }}/>
      </CardContent>
      <CardActions>
        <ReactionButton text={<ThumbUpIcon className={classes.yellow}/>} initialCount={props.reactions.like} sendReaction={() => { console.log('noop') }}/>
        <ReactionButton text={<ThumbDownIcon className={classes.yellow}/>} initialCount={props.reactions.unlike} sendReaction={() => { console.log('noop') }}/>
        <ReactionButton text={<FavoriteIcon className={classes.red}/>} initialCount={props.reactions.heart} sendReaction={() => { console.log('noop') }}/>
      </CardActions>
    </Card>)
}

export default CommentCard
