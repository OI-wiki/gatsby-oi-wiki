import { useEffect, useMemo } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_throttle
function throttle (func, timeFrame) {
  let lastTime = 0
  return () => {
    const now = new Date()
    if (now - lastTime >= timeFrame) {
      func()
      lastTime = now
    }
  }
}

export default function useThrottledOnScroll (callback, delay) {
  const throttledCallback = useMemo(
    () => (callback ? throttle(callback, delay) : noop),
    [callback, delay],
  )

  useEffect(() => {
    if (throttledCallback === noop) {
      return undefined
    }

    window.addEventListener('scroll', throttledCallback)
    return () => {
      window.removeEventListener('scroll', throttledCallback)
      throttledCallback.cancel()
    }
  }, [throttledCallback])
}
