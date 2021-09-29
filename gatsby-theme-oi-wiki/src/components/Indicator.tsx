import React from 'react'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography'

const StyledTyp = styled(Typography)(({ theme }) => css`
  padding: ${theme.spacing(0.5)}px ${theme.spacing(1)}px;
  color: ${theme.palette.common.white};
  border-radius: ${theme.shape.borderRadius};
  display: inline-block;

  &.info {
    background-color: ${theme.palette.info.main};
  }

  &.success {
    background-color: ${theme.palette.success.main};
  }

  &.warning {
    background-color: ${theme.palette.warning.main};
  }

  &.error {
    background-color: ${theme.palette.error.main};
  }
`)

export interface IndicatorProps {
  type: 'info' | 'success' | 'error' | 'warning' | undefined
  msg: string
}

const Indicator: React.FC<IndicatorProps> = ({ type, msg }: IndicatorProps) => {
  return (
    <StyledTyp className={type}>
      {msg}
    </StyledTyp>
  )
}

export default Indicator
