import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Edit from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import { observer } from 'mobx-react-lite'
import { editWarnStore } from '../stores/editWarnStore'

interface EditBtnProps {
  relativePath: string;
}

export interface TitleProps extends EditBtnProps {
  noEdit: boolean;
}

const StyledGrid = styled(Grid)`
  align-items: center;
  position: relative;
`

const StyledTyp = styled(Typography)(({ theme }) => css`
  font-weight: ${theme.typography.fontWeightBold};
`)

const StyledIconBtn = styled(IconButton)`
  margin: 0.8rem;
  position: absolute;
  right: 0;
`


const EditBtn: React.FC<EditBtnProps> = observer((props) => {
  useEffect(() => {
    editWarnStore.setRelativePath(props.relativePath)
  }, [props.relativePath])

  const editAction = (): void => {
    editWarnStore.setOpen(true)
  }

  return (
    <Tooltip title="编辑页面" arrow={true}>
      <StyledIconBtn onClick={editAction}>
        <Edit/>
      </StyledIconBtn>
    </Tooltip>
  )
})

const Title: React.FC<TitleProps> = (props) => {
  const { relativePath, noEdit, children } = props

  return (
    <StyledGrid container={true}>
      <StyledTyp variant="h1" flexGrow={1}>{children}</StyledTyp>
      {!noEdit && <EditBtn relativePath={relativePath}/>}
    </StyledGrid>
  )
}

export default Title
