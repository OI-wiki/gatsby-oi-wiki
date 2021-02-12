import React, { useState, useRef, useEffect } from 'react'
import { getElementSize, getElementViewPosition, Position, Size } from './utils'
import {
  Card,
  CardContent,
  Fade,
  CircularProgress,
  makeStyles,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { PreviewData, FetchStatus } from './LinkTooltip'
import { useDelay } from './hooks'
import { Link as GatsbyLink } from 'gatsby'
const lines = 4
const lineHeight = 1.5
const useStyles = makeStyles((theme) => ({
  fade: {
    lineHeight: `${lineHeight}em`,
    height: `${lineHeight * lines}em`,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
      content: '""',
      textAlign: 'right',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '30%',
      height: '1.5em',
      background: (theme.palette as any).fadeTextBackground,
    },
  },
}))
type PositionAndSize = {
  pos: Position,
  size: Size,
}
function adjustElementPosition (element: HTMLElement, { pos, size }: PositionAndSize) : void {
  if (!element) return
  const viewport = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }
  const linkWidth = element.parentElement?.parentElement?.offsetWidth || 0
  function setLower (): void {
    element.style.removeProperty('bottom')
    element.style.setProperty('top', '2em')
  }
  function setUpper (): void {
    element.style.removeProperty('top')
    element.style.setProperty('bottom', '2em')
  }
  function setRight (): void { // 控制横坐标
    element.style.removeProperty('right')
    let offset = 0
    offset = Math.max(offset, -pos.x + 12) // 不能超过屏幕左边
    offset = Math.min(offset, -pos.x + Math.max(0, viewport.width - size.width) - 12) // 不能超过屏幕右边
    element.style.setProperty('left', `${offset}px`)
  }
  function setLeft (): void { // 控制横坐标
    element.style.removeProperty('left')
    let offset = 0
    offset = Math.min(offset, pos.x+linkWidth - size.width-12) // 不能超过屏幕左边
    element.style.setProperty('right', `${offset}px`)
  }
  if (pos.y < viewport.height / 2) { // 位于上半部分
    setLower()
  } else {
    setUpper()
  }
  console.log(pos, linkWidth, viewport)
  if(pos.x + linkWidth / 2 < viewport.width / 2){
    setRight()
  } else {
    setLeft()
  }
  element.style.setProperty('max-width', `${viewport.width - 24}px`)
}

type Props = {
  children: any,
  content: PreviewData,
  status: FetchStatus,
  onOpen?: () => void,
  onHover?: () => void, // 不会延迟执行
  openDelay?: number,
  closeDelay?: number,
  to: string,
}
const ToolCard: React.FC<Props> = function (props: Props) {
  const classes = useStyles()
  const { children, content, status } = props
  const closeDelay = props.closeDelay || 0
  const openDelay = props.openDelay || 0
  const [open, setOpen] = useState(false)
  const poperRef = useRef(null)
  const [onOpen, onClose] = useDelay(() => {
    setOpen(true)
    props.onOpen && props.onOpen()
  }, () => {
    setOpen(false)
  }, openDelay, closeDelay)
  const position = useRef(null)

  useEffect(() => {
    if (open) {
      const data: PositionAndSize = {
        pos: getElementViewPosition(poperRef.current.parentElement),
        size: getElementSize(poperRef.current),
      }
      position.current = data
      adjustElementPosition(poperRef.current, data)
    }
  }, [open, content])

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={() => {
        onOpen()
        props.onHover && props.onHover()
      }}
      onMouseLeave={() => onClose()}
    >
      <GatsbyLink to={props.to}><Fade in={open}>
        <Card
          className="toolcard"
          elevation={3}
          style={{
            position: 'absolute',
            zIndex: 9999,
            width: '320px',
            bottom: '2em',
            left: 0,
          }}
          ref={poperRef}
        >
          {
            (status === 'fetching' || status === 'not_fetched') &&
            <CardContent style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }} >
              <CircularProgress></CircularProgress>
            </CardContent>
          }
          {status === 'fetched' &&
            <CardContent>
              <div className={classes.fade}>
                <strong>
                  {content.title + ' '}
                </strong>
                {content.text}
              </div>
            </CardContent>
          }
          {
            status === 'error' &&
              <Alert severity="error">无法获取页面预览</Alert>
          }
        </Card>
      </Fade></GatsbyLink>
      {children}
    </span>
  )
}

export default ToolCard
