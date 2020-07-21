import { Avatar, Button, Card, CardActions, CardContent, CardHeader, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'

import Time from '../Time'

interface Props {
  avatarLink: string,
  name: string,
  contentHTML: string,
  timestamp: number,
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
    background: '#faebd7',
  },
}))

const reactionButtonDefaultProps = {
  initialCount: 0,
  isClicked: false,
}
type ReactionButtonProps = {
  text: string,
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
      className={isClicked && classes.clickedBackground}
      onClick={clickFunc}
    >
      {count}
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
        <ReactionButton text="👍" sendReaction={() => { console.log('noop') }}/>
        <ReactionButton text="👎" sendReaction={() => { console.log('noop') }}/>
      </CardActions>
    </Card>)
}

export default CommentCard
