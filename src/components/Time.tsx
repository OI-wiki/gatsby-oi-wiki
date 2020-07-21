import React, { useState } from 'react'
import timeDifference from '../lib/relativeTime'

interface Props {
  timestamp: number
}

const Time: React.FC<Props> = ({ timestamp }) => {
  const [relativeMode, setRelativeMode] = useState(true)
  const toggle = (): void => {
    setRelativeMode(!relativeMode)
  }
  const now = new Date()
  return <div
    onClick={toggle}> {relativeMode ? timeDifference(+now, timestamp) : new Date(timestamp).toLocaleString()} </div>
}

export default Time
