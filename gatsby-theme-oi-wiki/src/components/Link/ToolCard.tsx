import React, { useState, useRef, useEffect } from 'react'
import { getElementViewPosition, Position } from './utils'

type Props = {
  children: any,
  content: JSX.Element | string,
  onOpen?: Function,
  closeDelay?: number,
}

function useDelayHover (onHover: Function, onUnhover: Function, delayUnhover: number) {
  let closeHandle
  function hover () {
    if (closeHandle) clearTimeout(closeHandle)
    onHover()
  }
  function unhover () {
    if (closeHandle) clearTimeout(closeHandle)
    closeHandle = setTimeout(onUnhover, delayUnhover)
  }
  return [hover, unhover]
}

function adjustElementPosition (element: HTMLElement, pos: Position) {
  console.log('adj', element, pos)
  function checkOverflowTop () {
    if (pos.y - pos.height < 20) { // 到顶端的距离 < 80
      element.style.removeProperty('bottom')
      element.style.setProperty('top', '2em')
    }
  }
  const viewportWidth = document.documentElement.offsetWidth
  function checkOverflowRight () {
    if (pos.x + pos.width + 5 > viewportWidth) { // 到右端的距离 < 5
      element.style.removeProperty('left')
      element.style.setProperty('right', '0')
    }
  }
  checkOverflowTop()
  checkOverflowRight()
}

export default function ToolCard (props: Props) {
  const { children, content } = props
  const closeDelay = props.closeDelay || 0
  const [open, setOpen] = useState(false)
  const poperRef = useRef(null)
  const [onOpen, onClose] = useDelayHover(() => {
    setOpen(true)
    props.onOpen()
  }, () => setOpen(false), closeDelay)
  const position = useRef(null)

  useEffect(() => {
    if (open) {
      const p = getElementViewPosition(poperRef.current)
      position.current = p
      adjustElementPosition(poperRef.current, p)
    }
  }, [open, content])

  return (
    <span
      style={{
        position: 'relative',
      }}
      onMouseEnter={() => {
        onOpen()
      }}
      onMouseLeave={() => {
        onClose()
      }}
    >
      <span
        className="toolcard"
        style={{
          display: open ? 'block' : 'none',
          position: 'absolute',
          background: '#fff',
          border: '1px black solid',
          zIndex: 9999,
          bottom: '2em',
          left: 0,
          width: 400,
          maxHeight: 300,
          overflowY: 'auto',
          padding: 12,
        }}
        ref={poperRef}
      >
        {content}
      </span>
      {children}
    </span>
  )
}
