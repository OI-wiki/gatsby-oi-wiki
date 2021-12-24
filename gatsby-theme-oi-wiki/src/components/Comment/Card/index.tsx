import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from '@material-ui/core';

import {
  Favorite as FavoriteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

import React, { useState } from 'react';
import { User } from '@mgtd/vssue-api-github-v4/lib/types';
import Time from '../../Time';
import { Reactions } from '../types';
import { useInputContentContext } from '../inputContext';
import { useStyles } from './styles';
import ReactionButton from './ReactionButton';

interface Props {
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
  addReaction: (commentID: string | number, reaction: 'heart' | 'unlike' | 'like') => Promise<void>,
  removeReaction: (commentID: string | number, reaction: 'heart' | 'unlike' | 'like') => Promise<void>
}

const CommentCard: React.FC<Props> = (props) => {
  const { name, time, disabled, currentUser, reactions, commentID } = props;
  const classes = useStyles();
  const like = reactions.find(item => item.type === 'like');
  const unlike = reactions.find(item => item.type === 'unlike');
  const heart = reactions.find(item => item.type === 'heart');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { setInputContent } = useInputContentContext();
  return (
    <Card variant="outlined" className={classes.commentMargin}>
      <CardHeader
        avatar={<Avatar alt={name} src={props.avatarLink} />}
        title={<>
          {props.name} {currentUser.username === props.name &&
            <IconButton
              disabled={disabled}
              size="small"
              aria-label="delete"
              className={classes.floatRight}
              onClick={
                () => { props.deleteComment(commentID, setDeleteLoading); }
              }>
              {deleteLoading
                ? <CircularProgress size={20} />
                : <DeleteIcon fontSize="small" />}
            </IconButton>}
          <IconButton
            size="small"
            aria-label="reply"
            className={classes.floatRight}
            onClick={() => {
              setInputContent(`> ${props.contentRaw}`);
            }}>
            <ReplyIcon fontSize="small" />
          </IconButton>
        </>}
        classes={{ root: classes.headerRoot }}
        subheader={<Time time={time} />} />
      <CardContent classes={{ root: classes.contentRoot }}>
        <div dangerouslySetInnerHTML={{ __html: props.contentHTML }} />
      </CardContent>
      <CardActions>
        <ReactionButton
          icon={ThumbUpIcon}
          clickedClass={classes.yellow}
          disabled={disabled}
          currentUser={currentUser}
          initialCount={like.count}
          isClicked={like.viewerHasReacted}
          addReaction={async () => { await props.addReaction(commentID, 'like'); }}
          removeReaction={async () => { await props.removeReaction(commentID, 'like'); }}
          users={like.users}
        />
        <ReactionButton
          icon={ThumbDownIcon}
          clickedClass={classes.yellow}
          disabled={disabled}
          currentUser={currentUser}
          initialCount={unlike.count}
          isClicked={unlike.viewerHasReacted}
          addReaction={async () => { await props.addReaction(commentID, 'unlike'); }}
          removeReaction={async () => { await props.removeReaction(commentID, 'unlike'); }}
          users={unlike.users}
        />
        <ReactionButton
          icon={FavoriteIcon}
          clickedClass={classes.red}
          disabled={disabled}
          currentUser={currentUser}
          initialCount={heart.count}
          isClicked={heart.viewerHasReacted}
          addReaction={async () => { await props.addReaction(commentID, 'heart'); }}
          removeReaction={async () => { await props.removeReaction(commentID, 'heart'); }}
          users={heart.users}
        />
      </CardActions>
    </Card>);
};

export default CommentCard;
