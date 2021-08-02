import { useEffect, useState } from 'react'

export interface WindowDimensions {
  width: number;
  height: number;
}

/**
 * 去抖动。具体来说，在组件更新的时候若 value 值发生变化后 timeout 的时间内都没有其他变化，才更新 state 值
 *
 * @param value 通常是一个经常发生变化的值
 * @param timeout
 */
const useDebounce = <T = any>(value: T, timeout: number): T => {
  const [state, setState] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout)

    return () => clearTimeout(handler)
  }, [value, timeout])

  return state
}

/**
 * 在组件挂载后计算屏幕宽度并返回
 */
const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = (): void => {
      setWindowDimensions({
        ...windowDimensions,
        width: window.innerWidth,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export { useDebounce, useWindowDimensions }
