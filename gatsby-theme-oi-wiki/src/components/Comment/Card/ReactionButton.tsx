import React, { useState } from 'react'
import clsx from 'clsx'
import { User } from '@mgtd/vssue-api-github-v4/lib/types'
import SvgIcon from '@mui/material/SvgIcon'
import Button from '@mui/material/Button'
import { AvatarGroup, CircularProgress } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import red from '@mui/material/colors/red'

const StyledBtn = styled(Button)`
  min-width: 0;

  &.null-reaction {
    padding: 5px 10px;

    .MuiButton-startIcon {
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.clicked {
    .MuiButton-startIcon {
      .red {
        color: ${red[500]}
      }

      .yellow {
        color: #ffcf56;
      }
    }
  }
`

const StyledAvatar = styled(Avatar)(({ theme }) => css`
  width: ${theme.spacing(3)};
  height: ${theme.spacing(3)};
  font-size: ${theme.spacing(1.5)};
`)

const reactionButtonDefaultProps = {
  initialCount: 0,
  isClicked: false,
}

export interface ReactionButtonProps extends Partial<typeof reactionButtonDefaultProps> {
  icon: typeof SvgIcon;
  iconClickedClassName: string;
  disabled: boolean;
  currentUser: User;
  addReaction: () => Promise<void>;
  removeReaction: () => Promise<void>;
  users: User[];
}

const ReactionButton: React.FC<ReactionButtonProps> = (props) => {
  const propsMerged = { ...reactionButtonDefaultProps, ...props }

  const [isClicked, setIsClicked] = useState(propsMerged.isClicked)
  const [count, setCount] = useState(propsMerged.initialCount)
  const [users, setUsers] = useState(propsMerged.users)
  const [loading, setLoading] = useState(false)

  const clickFunc = async (): Promise<void> => {
    if (isClicked) {
      setCount(count - 1)
      setLoading(true)
      await propsMerged.removeReaction()
      setLoading(false)
      const tmpUsers = users.filter(({ username }) => username !== propsMerged.currentUser.username)
      setUsers(tmpUsers)
    } else {
      setCount(count + 1)
      setLoading(true)
      await propsMerged.addReaction()
      setLoading(false)
      const tmpUsers: User[] = [...users, propsMerged.currentUser]
      setUsers(tmpUsers)
    }
    setIsClicked(!isClicked)
  }

  const SvgTag = props.icon

  return (
    <StyledBtn
      size="small"
      disabled={propsMerged.disabled || loading}
      startIcon={<SvgTag className={props.iconClickedClassName}/>}
      className={clsx({ 'null-reaction': count === 0, 'clicked': isClicked })}
      onClick={clickFunc}
    >
      {loading
        ? <CircularProgress size={24} sx={{ mx: '4px' }}/>
        : <>
          {count !== 0 && count}
          <AvatarGroup max={3} sx={{ ml: '4px' }}>
            {users.map(({ avatar, username }) => (
              <StyledAvatar alt={username} src={avatar} key={username}/>
            ))}
          </AvatarGroup>
        </>
      }
    </StyledBtn>
  )
}

export default ReactionButton
