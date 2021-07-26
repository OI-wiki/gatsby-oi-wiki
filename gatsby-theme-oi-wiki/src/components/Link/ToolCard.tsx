import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from '@material-ui/lab'
import { Card, CardContent, CircularProgress, Fade, makeStyles } from '@material-ui/core'
import { Link as GatsbyLink } from 'gatsby'

import { FetchStatus, PreviewData } from './LinkTooltip'
import { useDelay } from './hooks'
import { getElementSize, getElementViewPosition, Position, Size } from './utils'
import { Nullable } from '../../types/common'
import clsx from 'clsx'

const lines = 4
const lineHeight = 1.5
const cardDis = '2rem'
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
      background: theme.palette.fadeTextBackground,
    },
  },
  toolCard: {
    display: 'inline-block',
    position: 'absolute',
    zIndex: 9999,
    width: '320px',
    left: 0,
    top: cardDis,
  },
  aboveMedian: {
    top: 'initial',
    bottom: cardDis,
  },
  cardContent: {
    display: 'flex',
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
  const { children, content, status, closeDelay = 0, openDelay = 0, onHover } = props
  const [open, setOpen] = useState(false)

  const popperRef = useRef<HTMLElement>()
  const position = useRef<Nullable<PositionAndSize>>(null)
  const [onOpen, onClose] = useDelay(() => {
    setOpen(true)
    props.onOpen?.()
    onHover?.()
  }, () => {
    setOpen(false)
  }, openDelay, closeDelay)

  const adjustElementPosition = useCallback((element: HTMLElement, { pos, size }: PositionAndSize): void => {
    if (!element) return

    const viewport = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }

    const linkWidth = element.parentElement?.parentElement?.offsetWidth || 0

    // 控制横坐标
    function setRight(): void {
      element.style.removeProperty('right')
      let offset = 0
      // 不能超过屏幕左边
      offset = Math.max(offset, -pos.x + 12)
      // 不能超过屏幕右边
      offset = Math.min(offset, -pos.x + Math.max(0, viewport.width - size.width) - 12)
      element.style.setProperty('left', `${offset}px`)
    }

    // 控制横坐标
    function setLeft(): void {
      element.style.removeProperty('left')
      let offset = 0
      // 不能超过屏幕左边
      offset = Math.min(offset, pos.x + linkWidth - size.width - 12)
      element.style.setProperty('right', `${offset}px`)
    }

    element.classList.toggle(classes.aboveMedian, pos.y > viewport.height / 2)

    // 位于左半部分
    if (pos.x + linkWidth / 2 < viewport.width / 2) {
      setRight()
    } else {
      setLeft()
    }

    element.style.setProperty('max-width', `${viewport.width - 24}px`)
  }, [classes.aboveMedian])

  useEffect(() => {
    if (open && popperRef.current) {
      const data: PositionAndSize = {
        pos: getElementViewPosition(popperRef.current.parentElement as HTMLElement),
        size: getElementSize(popperRef.current),
      }
      position.current = data
      adjustElementPosition(popperRef.current, data)
    }
  }, [open, content, popperRef, adjustElementPosition])

  return <span
    style={{
      position: 'relative',
      display: 'inline-block',
    }}
    onMouseEnter={onOpen}
    onMouseLeave={onClose}
  >
      <GatsbyLink to={props.to}>
        <Fade in={open}>
          <Card
            component='span'
            className={classes.toolCard}
            elevation={3}
            ref={popperRef}
          >
            {(() => {
              switch (status) {
                case 'not_fetched':
                case 'fetching':
                  return <CardContent component='span' className={clsx(classes.fetching, classes.cardContent)}>
                    <CircularProgress/>
                  </CardContent>
                case 'fetched':
                  return <CardContent component='span' className={classes.cardContent}>
                    <span className={classes.fade}>
                      <strong>{content?.title + ' '}</strong>
                      {content?.text}
                    </span>
                  </CardContent>
                case 'error':
                default:
                  return <Alert severity="error">无法获取页面预览</Alert>
              }
            })()}
          </Card>
        </Fade>
      </GatsbyLink>
    {children}
    </span>
}

export default ToolCard
