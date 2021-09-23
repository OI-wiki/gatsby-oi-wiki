import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { FetchStatus, PreviewData } from './LinkTooltip'
import { useDelay } from './hooks'
import { getElementSize, getElementViewPosition, Position, Size } from './utils'
import { Nullable } from '../../types/common'
import styled from '@mui/material/styles/styled'
import Card from '@mui/material/Card'
import { css } from '@emotion/react'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

const LINES = 4
const LINE_HEIGHT = 1.5
const CARD_DIS = '2rem'

const Container = styled('span')`
  position: relative;
  display: inline-block;
`

const StyledCard = styled(Card)(({ theme }) => css`
  width: 320px;
  position: absolute;
  left: 0;
  top: ${CARD_DIS};
  max-width: calc(100vw - 40px);
  z-index: ${theme.zIndex.tooltip};
`)

const FetchingContent = styled(CardContent)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const FetchedContentDiv = styled('div')`
  line-height: ${LINE_HEIGHT}em;
  height: ${LINE_HEIGHT * LINES}em;
  overflow: hidden;
  position: relative;

  &:after {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30%;
    height: ${LINE_HEIGHT}em;
    background-color: white;
  }
`

const aboveMedianStyle = css`
  top: initial;
  bottom: ${CARD_DIS};
`

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
  const { children, content, status, closeDelay = 0, openDelay = 0, onHover, to } = props
  const [open, setOpen] = useState(false)
  const rootRef = createRef<HTMLDivElement>()
  const popperRef = useRef<HTMLDivElement>(null)
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
      const toRight = viewport.width - cardRightX - betterDis
      if (toRight >= 0) {
        left = 0
      } else {
        const gap = pos.x + toRight
        left = gap >= 0 ? toRight : gap
      }
    } else {
      const { width } = getElementSize(rootRef.current)
      const rootRightX = pos.x + width
      const toLeft = rootRightX - size.width - betterDis
      if (toLeft >= 0) {
        right = 0
      } else {
        const gap = viewport.width + toLeft
        right = gap >= 0 ? toLeft : gap
      }
    }

    element.style.setProperty('right', typeof right === 'undefined' ? 'auto' : `${right}px`)
    element.style.setProperty('left', typeof left === 'undefined' ? 'auto' : `${left}px`)
    element.classList.toggle(aboveMedianStyle.name, pos.y > viewport.height / 2)

  }, [rootRef])

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
    <Container
      onMouseEnter={() => {
        onOpen()
        onHover?.()
      }}
      onMouseLeave={onClose}
      ref={rootRef}
    >
      {/* to temporarily fix issue https://github.com/OI-wiki/gatsby-oi-wiki/issues/928 */}
      <div className='math math-display'/>
      <GatsbyLink to={to}>
        <Fade in={open}>
          <StyledCard
            elevation={3}
            ref={popperRef}
          >
            {(() => {
              if (status === 'not_fetched' || status === 'fetching') {
                return <FetchingContent>
                  <CircularProgress/>
                </FetchingContent>
              } else if (status === 'fetched') {
                return <CardContent>
                  <FetchedContentDiv>
                    <strong>{content?.title + ' '}</strong>
                    {content?.text}
                  </FetchedContentDiv>
                </CardContent>
              } else {
                return <Alert severity="error">无法获取页面预览</Alert>
              }
            })()}
          </StyledCard>
        </Fade>
      </GatsbyLink>
      {children}
    </Container>
  )
}

export default ToolCard
