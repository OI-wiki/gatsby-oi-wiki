import kebabCase from 'lodash/kebabCase'
import React from 'react'
import styled from '@mui/material/styles/styled'
import Chip from '@mui/material/Chip'
import { css } from '@emotion/react'
import SmartLink from './SmartLink'
import Box from '@mui/material/Box'

const StyledChip = styled(Chip)(({ theme }) => css`
  margin: ${theme.spacing(0.5)};
`) as typeof Chip

export interface TagsProps {
  tags: string[]
}

const Tags: React.FC<TagsProps> = (props: TagsProps) => {
  return (
    <Box>
      {props.tags.map((tag) => (
        <StyledChip
          key={`tag-${tag}`}
          component={SmartLink}
          href={'/tags/' + kebabCase(tag)}
          label={` #${tag} `}
          variant="outlined"
          clickable={true}/>
      ))}
    </Box>
  )
}

export default Tags
