import { makeStyles, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  indicator: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    display: 'inline-block',
  },
  info: {
    background: theme.palette.info.main,
  },
  success: {
    background: theme.palette.success.main,
  },
  warning: {
    background: theme.palette.warning.main,
  },
  error: {
    background: theme.palette.error.main,
  },
}))

export interface IndicatorProps {
  type: 'info' | 'success' | 'error' | 'warning' | undefined
  msg: string
}

const Indicator: React.FC<IndicatorProps> = ({ type, msg }: IndicatorProps) => {
  const classes = useStyles()
  return (
    <Typography
      className={clsx(classes.indicator, {
        [classes.info]: type === 'info',
        [classes.success]: type === 'success',
        [classes.error]: type === 'error',
        [classes.warning]: type === 'warning',
      })}
    >
      {msg}
    </Typography>
  )
}

export default Indicator
