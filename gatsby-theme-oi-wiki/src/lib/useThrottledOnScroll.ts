import { useEffect, useMemo } from 'react'
import { noopNull, throttle } from '../utils/common'

const useThrottledOnScroll = (callback: (...agrs: any) => any, delay: number): void => {
  const throttledCallback = useMemo(
    () => (callback ? throttle(callback, delay) : noopNull),
    [callback, delay],
  )

  useEffect(() => {
    if (throttledCallback === noopNull) return

    window.addEventListener('scroll', throttledCallback, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledCallback, { passive: true })

      ;(throttledCallback as ReturnType<typeof throttle>).cancel()
    }
  }, [throttledCallback])
}

export default useThrottledOnScroll
