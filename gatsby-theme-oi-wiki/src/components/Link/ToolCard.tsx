import React, { useState, useRef, useEffect } from 'react'
import { getElementViewPosition, Position } from './utils'
import {
  Card,
  CardContent,
  Fade,
  Typography,
} from '@material-ui/core'

import { PreviewData } from './LinkTooltip'

type Props = {
  children: any,
  content: PreviewData,
  onOpen?: () => void,
  closeDelay?: number,
}

function useDelayHover (onHover: () => void, onUnhover: () => void, delayUnhover: number) : [() => void, () => void] {
  let closeHandle
  function hover () : void {
    if (closeHandle) clearTimeout(closeHandle)
    onHover()
  }
  function unhover () : void {
    if (closeHandle) clearTimeout(closeHandle)
    closeHandle = setTimeout(onUnhover, delayUnhover)
  }
  return [hover, unhover]
}

function adjustElementPosition (element: HTMLElement, pos: Position) : void {
  console.log('adj', element, pos)
  function checkOverflowTop () : void {
    if (pos.y - pos.height < 20) { // 到顶端的距离 < 80
      element.style.removeProperty('bottom')
      element.style.setProperty('top', '2em')
    }
  }
  const viewportWidth = document.documentElement.offsetWidth
  function checkOverflowRight () : void {
    if (pos.x + pos.width + 5 > viewportWidth) { // 到右端的距离 < 5
      element.style.removeProperty('left')
      element.style.setProperty('right', '0')
    }
  }
  checkOverflowTop()
  checkOverflowRight()
}

const ToolCard : React.FC<Props> = function (props: Props) {
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
      <Fade in={open}>
        <Card
          className="toolcard"
          elevation={3}
          style={{
            position: 'absolute',
            zIndex: 9999,
            bottom: '2em',
            left: 0,
            width: 400,
            maxHeight: 300,
            overflowY: 'auto',
          }}
          ref={poperRef}
        >
          {content &&
            <CardContent>
              <Typography variant="h6">
                {content.title}
              </Typography>
              <Typography variant="body2">
                <div dangerouslySetInnerHTML={{ __html: content.html }} />
              </Typography>
            </CardContent>
          }
        </Card>
      </Fade>
      {children}
    </span>
  )
}

export default ToolCard
