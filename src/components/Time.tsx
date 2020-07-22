import React, { useState, useEffect } from 'react'
import timeDifference from '../lib/relativeTime'

interface Props {
  timestamp: number
}

const Time: React.FC<Props> = ({ timestamp }) => {
  const [relativeMode, setRelativeMode] = useState(true)
  const toggle = (): void => {
    setRelativeMode(!relativeMode)
  }
  const [now, setNow] = useState<number>(+(new Date()))
  useEffect(() => {
    const t = setInterval(() => { setNow(+(new Date())) }, 30 * 1000)
    return () => { clearInterval(t) }
  }, [])
  return <span style={{ cursor: 'pointer' }}
    onClick={toggle}> {relativeMode ? timeDifference(+now, timestamp) : new Date(timestamp).toLocaleString()} </span>
}

export default Time
