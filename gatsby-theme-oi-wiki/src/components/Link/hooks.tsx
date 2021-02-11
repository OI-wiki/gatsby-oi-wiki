import { useRef, useEffect } from 'react'

export function useDidUpdateEffect (fn, inputs): void {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) { fn() } else { didMountRef.current = true }
  }, inputs)
}

export function useDelay (onOpen: () => void, onClose: () => void, openDelay: number, closeDelay: number) : [() => void, () => void] {
  const closeHandle = useRef(null)
  const openHandle = useRef(null)
  function open () : void {
    if (closeHandle.current) { // 正在准备close，则不让它close
      clearTimeout(closeHandle.current)
      closeHandle.current = null
    }
    if (!openHandle.current) { // 如果之前没有 open 时间就创建一个
      openHandle.current = setTimeout(() => {
        onOpen()
        openHandle.current = null
      }, openDelay)
    }
  }
  function close () : void {
    if (closeHandle) { // 之前的 close 事件需要被清除
      clearTimeout(closeHandle.current)
      closeHandle.current = null
    }
    if (openHandle.current) { // 鼠标快进快出，则不显示
      clearTimeout(openHandle.current)
      openHandle.current = null
    }
    closeHandle.current = setTimeout(() => {
      onClose()
      closeHandle.current = null
    }, closeDelay)
  }
  return [open, close]
}
