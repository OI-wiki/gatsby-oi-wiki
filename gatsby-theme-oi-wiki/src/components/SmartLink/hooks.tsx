import React, { useEffect, useRef } from 'react'
import { Nullable } from '../../types/common'

export function useDidUpdateEffect(fn: (...args: any) => void, inputs: React.DependencyList): void {
  const didMountRef = useRef(false)
  const fnRef = useRef(fn)

  useEffect(() => {
    if (didMountRef.current) fnRef.current()
    else didMountRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs)
}

export function useDelay(onOpen: () => void, onClose: () => void, openDelay: number, closeDelay: number): [() => void, () => void] {
  const closeHandle = useRef<Nullable<NodeJS.Timeout>>()
  const openHandle = useRef<Nullable<NodeJS.Timeout>>()

  const clearClose = (): void => {
    if (closeHandle.current) {
      clearTimeout(closeHandle.current)
      closeHandle.current = null
    }
  }

  const clearOpen = (): void => {
    if (openHandle.current) {
      clearTimeout(openHandle.current)
      openHandle.current = null
    }
  }

  function open(): void {
    // 正在准备close，则不让它close
    clearClose()

    // 如果之前没有 open 事件就创建一个
    if (!openHandle.current) {
      openHandle.current = setTimeout(() => {
        onOpen()
        clearOpen()
      }, openDelay)
    }
  }

  function close(): void {
    // 之前的 close 事件需要被清除
    clearClose()
    // 鼠标快进快出，则不显示
    clearOpen()

    closeHandle.current = setTimeout(() => {
      onClose()
      clearClose()
    }, closeDelay)
  }

  return [open, close]
}
