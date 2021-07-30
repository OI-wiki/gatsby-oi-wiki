import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CircularProgress, Fade, makeStyles } from '@material-ui/core'
import { Link as GatsbyLink } from 'gatsby'

import { FetchStatus, PreviewData } from './LinkTooltip'
import { useDelay } from './hooks'
import { getElementSize, getElementViewPosition, Position, Size } from './utils'
import { Nullable } from '../../types/common'
import { Alert } from '@material-ui/lab'

const lines = 4
const lineHeight = 1.5
const cardDis = '2rem'
const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    display: 'inline-block',
  },
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
      background: theme.palette.fadeTextBackground,
    },
  },
  toolCard: {
    position: 'absolute',
    zIndex: 9999,
    width: '320px',
    left: 0,
    top: cardDis,
    maxWidth: 'calc(100vw - 40px)',
  },
  aboveMedian: {
    top: 'initial',
    bottom: cardDis,
  },
  fetching: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

interface PositionAndSize {
  pos: Position,
  size: Size,
}

export interface ToolCardProps {
  content: Nullable<PreviewData>,
  status: FetchStatus,
  onOpen?: () => void,
  /** 不会延迟执行 */
  onHover?: () => void,
  openDelay?: number,
  closeDelay?: number,
  to: string,
}

const ToolCard: React.FC<ToolCardProps> = (props) => {
  const classes = useStyles()
  const { children, content, status, closeDelay = 0, openDelay = 0, onHover, to } = props
  const [open, setOpen] = useState(false)
  const rootRef = createRef<HTMLDivElement>()
  const popperRef = useRef<HTMLElement>()
  const [onOpen, onClose] = useDelay(() => {
    setOpen(true)
    props.onOpen?.()
  }, () => {
    setOpen(false)
  }, openDelay, closeDelay)

  const adjustElementPosition = useCallback((element: HTMLElement, { pos, size }: PositionAndSize): void => {
    if (!element || !rootRef.current) return

    const viewport = {
      width: window?.innerWidth || document.documentElement.clientWidth,
      height: window?.innerHeight || document.documentElement.clientHeight,
    }
    const betterDis = 20

    let left, right

    // On the left half of the screen
    if (pos.x < viewport.width / 2) {
      const cardRightX = pos.x + size.width
      const toRight = viewport.width - cardRightX
      if (toRight >= 0) {
        left = 0
      } else {
        const gap = pos.x + toRight
        left = (gap >= 0 ? toRight : gap) - betterDis
      }
    } else {
      const { width } = getElementSize(rootRef.current)
      const rootRightX = pos.x + width
      const toLeft = rootRightX - size.width
      if (toLeft >= 0) {
        right = 0
      } else {
        const gap = viewport.width + toLeft
        right = (gap >= 0 ? toLeft : gap) - betterDis
      }
    }

    element.style.setProperty('right', right ? `${right}px` : 'auto')
    element.style.setProperty('left', left ? `${left}px` : 'auto')
    element.classList.toggle(classes.aboveMedian, pos.y > viewport.height / 2)

  }, [classes.aboveMedian, rootRef])

  useEffect(() => {
    if (open && popperRef.current) {
      const data: PositionAndSize = {
        pos: getElementViewPosition(popperRef.current.parentElement as HTMLElement),
        size: getElementSize(popperRef.current),
      }
      adjustElementPosition(popperRef.current, data)
    }
  }, [open, content, popperRef, adjustElementPosition, rootRef])

  return (
    <div
      className={classes.container}
      onMouseEnter={() => {
        onOpen()
        onHover?.()
      }}
      onMouseLeave={onClose}
      ref={rootRef}
    >
      <GatsbyLink to={to}>
        <Fade in={open}>
          <Card
            className={classes.toolCard}
            elevation={3}
            ref={popperRef}
          >
            {(() => {
              if (status === 'not_fetched' || status === 'fetching') {
                return <CardContent className={classes.fetching}>
                  <CircularProgress/>
                </CardContent>
              } else if (status === 'fetched') {
                return <CardContent>
                  <span className={classes.fade}>
                    <strong>{content?.title + ' '}</strong>
                    {content?.text}
                  </span>
                </CardContent>
              } else {
                return <Alert severity="error">无法获取页面预览</Alert>
              }
            })()}
          </Card>
        </Fade>
      </GatsbyLink>
      {children}
    </div>
  )
}

export default ToolCard
