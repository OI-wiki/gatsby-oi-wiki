import { Nullable } from '../../types/common'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useThrottledOnScroll from '../../lib/useThrottledOnScroll'
import Typography from '@mui/material/Typography'
import TocList, { TocListProps, TocNode } from './TocList'
import { bindHTMLElement, getNextItem, getPrevItem, nodeSetActive, tocConverter, TocItem } from './util'
import styled from '@mui/material/styles/styled'
import Grid from '@mui/material/Grid'
import { css } from '@emotion/react'

export interface TocContainerProps {
  toc: TocItem[];
}


const Container = styled(Grid)(({ theme }) => css`
  flex-shrink: 0;
  padding: ${theme.spacing(2, 2, 2, 0)};
  display: block;

  ${theme.breakpoints.down('md')} {
    display: none;
  }
`)

const Title = styled(Typography)(({ theme }) => css`
  margin-top: ${theme.spacing(2)};
  padding-left: ${theme.spacing(1.5)};
`)

const TocContainer: React.FC<TocContainerProps> = (props) => {
  const { toc } = props

  const newItems = useRef(tocConverter(toc))
  const clickedRef = useRef(false)
  const unsetClickedRef = useRef<ReturnType<typeof setTimeout>>()
  const [activeState, setActiveState] = useState<Nullable<TocNode>>(null)
  const lstScrollTopRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick: TocListProps['onClick'] = (item) => (event) => {
    event.preventDefault()

    const hash = item.url
    const yDis = (item.element?.getBoundingClientRect().top || 0) + window?.pageYOffset

    // smoothScrollTo(yDis)
    window?.scrollTo(0, yDis)

    window?.history.pushState(null, '', hash)
    clickedRef.current = true

    // clear last unfinished timeout
    if (unsetClickedRef.current) clearTimeout(unsetClickedRef.current)
    unsetClickedRef.current = setTimeout(() => {
      clickedRef.current = false
    }, 100)

    if (activeState?.url !== hash) {
      updateActive(item)
    }
  }

  const updateActive = useCallback((state: Nullable<TocNode>): void => {
    if (activeState?.url === state?.url) return

    nodeSetActive(activeState, false)
    nodeSetActive(state, true)
    setActiveState(state)
  }, [activeState])


  const activeTocOnScroll = useCallback((): void => {
    if (clickedRef.current) return

    const TO_TOP_DIS = 20
    const pageScrollTop = window?.pageYOffset || document.documentElement.scrollTop
    let node: Nullable<TocNode> = activeState || newItems.current[0]

    // down dir
    if (pageScrollTop > lstScrollTopRef.current) {
      let minDisNode = node
      while (node) {
        if (
          node.element &&
          node.element.getBoundingClientRect().top > TO_TOP_DIS + 20
        ) {
          break
        } else {
          if (node !== minDisNode) minDisNode = node
          node = node.children.length > 0
            ? node.children[0]
            : getNextItem(newItems.current, node)
        }
      }
      node = minDisNode
    } else {
      while (node) {
        // node may have no ele which caused by error id
        if (
          !node.element ||
          node.element.getBoundingClientRect().top <= TO_TOP_DIS
        ) {
          break
        } else {
          node = getPrevItem(newItems.current, node)
        }
      }
    }

    if (activeState !== node) {
      updateActive(node)

      // scroll the toc
      // if (node?.selfElement) node.selfElement.scrollIntoView()
      // else containerRef.current?.scrollTo({ top: 0 })

      //  change hash
      window.history.replaceState(null, '', node?.url)
    }

    lstScrollTopRef.current = pageScrollTop
  }, [activeState, updateActive])

  useEffect(() => {
    bindHTMLElement(newItems.current)
  }, [toc])

  useThrottledOnScroll(activeTocOnScroll, 100)

  useEffect(
    () => {
      return () => {
        clearTimeout(unsetClickedRef.current as never as number)
      }
    },
    [],
  )

  return (
    newItems.current.length > 0
      ? <Container ref={containerRef} aria-label="pageTOC">
        <Title gutterBottom={true}>目录</Title>
        <TocList data={newItems.current} onClick={handleClick}/>
      </Container>
      : <></>
  )
}

const TocContainerMemo = React.memo(TocContainer)

export default TocContainerMemo
