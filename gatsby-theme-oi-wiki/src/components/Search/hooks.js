import { useEffect, useState } from 'react'

/**
 * 去抖动。具体来说，在组件更新的时候若 value 值发生变化后 timeout 的时间内都没有其他变化，才更新 state 值
 *
 * @param {*} value 通常是一个经常发生变化的值
 * @param {number} timeout
 * @return {*} 一个 state
 */
export function useDebounce (value, timeout) {
  const [state, setState] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout)

    return () => clearTimeout(handler)
  }, [value, timeout])

  return state
}

/**
 * 在组件挂载后计算屏幕宽度并返回
 *
 * @return {number} 当前的屏幕宽度
 */
export function useWindowDimensions () {
  const [windowDimensions, setWindowDimensions] = useState({
    width: null,
    height: null,
  })
  // const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

  useEffect(() => {
    function handleResize () {
      // console.log('updated window')
      setWindowDimensions({
        width: window.innerWidth,
        // height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}
