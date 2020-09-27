import React, { useState, useEffect } from 'react'
import timeDifference from '../lib/relativeTime'

const defaultProps = {
  defaultShowRelative: true,
  updateInterval: 30 * 1000,
}
type Props = {
  time: number | Date | string
} & Partial<typeof defaultProps>

const Time: React.FC<Props> = (props) => {
  const { time, defaultShowRelative, updateInterval } = { ...defaultProps, ...props }
  const [relativeMode, setRelativeMode] = useState(defaultShowRelative)
  const timestamp = +new Date(time)
  const toggle = (): void => {
    setRelativeMode(!relativeMode)
  }
  const [now, setNow] = useState<number>(+(new Date()))
  useEffect(() => {
    const t = setInterval(() => { setNow(+(new Date())) }, updateInterval)
    return () => { clearInterval(t) }
  }, [updateInterval])
  return <span style={{ cursor: 'pointer' }}
    onClick={toggle}> {relativeMode ? timeDifference(+now, timestamp) : new Date(timestamp).toLocaleString()} </span>
}

export default Time
