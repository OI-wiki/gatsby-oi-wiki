import { Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useStyles } from './styles'
import { useSetting } from '../../lib/useSetting'
import TocList, { Node, TocListProps } from './Toc'
import { Nullable } from '../../types/common'
import smoothScrollTo from '../../lib/smoothScroll'
import useThrottledOnScroll from '../../lib/useThrottledOnScroll'

export interface TocItem {
  url: string,
  title: string;
  items?: TocItem[];
  level: number;
}

export interface TocObj {
  items: TocItem[];
}

export interface TocProps {
  pathname: string;
  toc: TocObj;
}

const getIDFromHash = (url: string): string => url?.replace(/^#/, '')

const TocConverter = (items: TocItem[]): Node[] => {
  const minLevel = items.reduce((v, i) => Math.min(v, i.level), 5)
  const curNode: Nullable<Node>[] = Array.from({ length: 6 }, () => null)
  const data: Node[] = []

  items.forEach((item) => {
    const level = item.level - minLevel
    const newNode: Node = {
      url: item.url,
      title: item.title,
      level: level,
      children: [],
      status: 'collapse',
      element: null,
      parent: null,
    }
    curNode[level] = newNode

    if (level === 0) {
      data.push(newNode)
    } else {
      if (curNode[level - 1]) (curNode[level - 1] as Node).children.push(newNode)
      newNode.parent = curNode[level - 1]
    }
  })
  return data
}

const bindHTMLElement = (toc: Node[]): void => {
  toc.forEach((i, idx, arr) => {
    if (i.element === null) arr[idx].element = document.getElementById(getIDFromHash(i.url))
    if (i.children) bindHTMLElement(i.children)
  })
}

const TocEl: React.FC<TocProps> = (props) => {
  const { toc } = props
  const items = toc.items
  const classes = useStyles()
  const theme = useTheme()
  const [settings] = useSetting()

  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const tabHeight = isMdDown ? 64 : 112
  const scrollPadding = 24

  const newItems = useRef(TocConverter(items))
  const clickedRef = useRef(false)
  const unsetClickedRef = useRef<ReturnType<typeof setTimeout>>()
  const [activeState, setActiveState] = useState<Nullable<Node>>(null)

  useEffect(() => {
    bindHTMLElement(newItems.current)
  }, [items])

  const nodeSetActive = (node: Nullable<Node>, val: boolean): void => {
    for (let u = node; u !== null; u = u.parent) u.status = val ? 'expanded' : 'collapse'
    if (val && node) node.status = 'active'
  }

  const updateActive = useCallback((state: Node): void => {
    nodeSetActive(activeState, false)
    nodeSetActive(state, true)
    setActiveState(state)
  }, [activeState])

  const newFindActiveItem = useCallback(() => {
    if (clickedRef.current) return

    const filter = (u: Node): boolean =>
      u.element?.offsetParent?.offsetTop <
      (document.documentElement.scrollTop + document.documentElement.clientHeight / 8 + 50)

    const findActive = (toc: Node[]): Nullable<Node> => {
      if (toc) {
        for (let i = toc.length - 1; i >= 0; i--) {
          if (filter(toc[i])) return findActive(toc[i].children) || toc[i]
        }
      }
      return null
    }

    const active = document.documentElement.scrollTop < 200 ? null : findActive(newItems.current)

    if (!(activeState?.url === active?.url)) {
      updateActive(active as Node)
    }
  }, [activeState?.url, updateActive])

  useThrottledOnScroll(newFindActiveItem, 166)

  const handleClick: TocListProps['onClick'] = (item) => (event) => {
    const hash = item.url
    if (settings.animation.smoothScroll) {
      event.preventDefault()

      // Used to disable findActiveIndex if the page scrolls due to a click
      const targetElement = document.getElementById(hash.substring(1, hash.length))
      smoothScrollTo((targetElement?.offsetParent as any)?.offsetTop - tabHeight - scrollPadding)
      history.pushState(null, '', hash)
      clickedRef.current = true
      unsetClickedRef.current = setTimeout(() => {
        clickedRef.current = false
      }, 1000)
    }

    if (activeState?.url !== hash) {
      // console.log('after click:', item)
      updateActive(item)
    }
  }

  useEffect(
    () => {
      clearTimeout(unsetClickedRef.current as never as number)
    },
    [],
  )

  return (
    <nav className={classes.main} aria-label="pageTOC">
      {newItems.current.length > 0 &&
      <>
        <Typography gutterBottom className={classes.contents}>
          目录
        </Typography>
        <TocList data={newItems.current} onClick={handleClick}/>
      </>
      }
    </nav>
  )
}

const Toc = React.memo(TocEl, (prev, next) => prev.pathname === next.pathname)

export default Toc
