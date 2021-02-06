import { useEffect, useMemo } from 'react'
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/**
 * Creates and returns a new, throttled version of the passed function, 
 * that, when invoked repeatedly, will only actually call the original 
 * function at most once per every wait milliseconds.
 * (from underscore.js)
 *
 * @param {*} func
 * @param {*} wait
 * @param {*} options
 * @return {*} 
 */
function throttle (func, wait, options) {
  let timeout, context, args, result
  let previous = 0
  if (!options) options = {}

  const later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function () {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function () {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }
  return throttled
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

    window.addEventListener('scroll', throttledCallback, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledCallback, { passive: true })
      throttledCallback.cancel()
    }
  }, [throttledCallback])
}
