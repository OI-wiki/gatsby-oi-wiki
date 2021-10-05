import React, { useMemo, useState } from 'react'
import { timeDifference } from './utils'
import Typography from '@mui/material/Typography'
import { Tooltip } from '@mui/material'

export interface TimeProps {
  time: number | Date | string;
  showRelative?: boolean,
}


const Time: React.FC<TimeProps> = (props) => {
  const { time, showRelative = true } = props
  const [relativeMode, setRelativeMode] = useState(showRelative)

  const timeStr = useMemo(() => {
    const timestamp = new Date(time)
    return relativeMode
      ? timeDifference(Date.now(), +timestamp)
      : timestamp.toLocaleString()
  }, [relativeMode, time])


  const toggle = (): void => {
    setRelativeMode(!relativeMode)
  }

  return (
    <Tooltip title="click to switch between relative and absolute time" arrow={true}>
      <Typography component="span" sx={{ cursor: 'pointer' }} onClick={toggle}>
        {timeStr}
      </Typography>
    </Tooltip>
  )
}

export default Time
