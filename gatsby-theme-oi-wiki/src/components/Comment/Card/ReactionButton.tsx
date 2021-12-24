import {
  Avatar,
  Button,
  CircularProgress,
} from '@material-ui/core';

import React, { useState } from 'react';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import clsx from 'clsx';
import { User } from '@mgtd/vssue-api-github-v4/lib/types';
import { useStyles } from './styles';

import { SvgIconComponent } from '@material-ui/icons';

const reactionButtonDefaultProps = {
  initialCount: 0,
  isClicked: false,
};

type ReactionButtonProps = {
  icon: SvgIconComponent
  clickedClass: string
  disabled: boolean
  currentUser: User
  addReaction: () => Promise<void>,
  removeReaction: () => Promise<void>,
  users: User[],
} & Partial<typeof reactionButtonDefaultProps>

const ReactionButton: React.FC<ReactionButtonProps> = (props) => {
  const classes = useStyles();
  const propsMerged = { ...reactionButtonDefaultProps, ...props };
  const [isClicked, setIsClicked] = useState(propsMerged.isClicked);
  const [count, setCount] = useState(propsMerged.initialCount);
  const [users, setUsers] = useState(propsMerged.users);
  const [loading, setLoading] = useState(false);
  const clickFunc = async (): Promise<void> => {
    if (isClicked) {
      setCount(count - 1);
      setLoading(true);
      await propsMerged.removeReaction();
      setLoading(false);
      const tmpUsers = users.filter(({ username }) => username !== propsMerged.currentUser.username);
      setUsers(tmpUsers);
    } else {
      setCount(count + 1);
      setLoading(true);
      await propsMerged.addReaction();
      setLoading(false);
      const tmpUsers: User[] = [...users, propsMerged.currentUser];
      setUsers(tmpUsers);
    }
    setIsClicked(!isClicked);
  };
  const SvgTag = props.icon;
  return (
    <Button
      color="default"
      size="small"
      disabled={propsMerged.disabled || loading}
      startIcon={<SvgTag className={clsx(isClicked && props.clickedClass)} />}
      className={clsx(count === 0 && classes.nullReaction, classes.reactionButton)}
      onClick={clickFunc}
      classes={count === 0 ? { startIcon: classes.nullReactionStartIcon, label: classes.labelMargin } : undefined}
    >
      {loading ? <CircularProgress size={24} style={{ marginLeft: '4px', marginRight: '4px' }} /> : (count !== 0 && count)}
      {!loading && <AvatarGroup max={3} style={{ marginLeft: '4px' }} classes={{ avatar: classes.avatarSmall }}>
        {users.map(({ avatar, username }) => (
          <Avatar alt={username} src={avatar} key={username} />
        ))}
      </AvatarGroup>}
    </Button>
  );
};

export default ReactionButton;
