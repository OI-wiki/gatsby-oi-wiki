import { useEffect, useMemo } from 'react'
import { noopNull, throttle } from '../utils/common'
import { AnyFunc } from '../types/common'

const useThrottledOnScroll = (callback: AnyFunc, delay: number): void => {
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

export { useThrottledOnScroll }
