import { Typography, useTheme, useMediaQuery } from '@material-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import smoothScrollTo from '../../lib/smoothScroll'
import useThrottledOnScroll from '../../lib/useThrottledOnScroll'
import { useStyles } from './styles'
import { useSetting } from '../../lib/useSetting'

import Slug from 'github-slugger'

import Toc, { Node } from './Toc'

function getIDfromHash (url:string):string {
  return url?.replace(/^#/, '')
}

interface Item{
  value: string;
  depth: number;
}
interface Toc{
  pathname: string;
  toc: Item[];
}

function Tocize (items: Item[]): Node[] {
  const minLevel = items.reduce((v, i) => Math.min(v, i.depth), 5)
  const curNode = [null, null, null, null, null, null]
  const data = []
  const slugs = new Slug()
  slugs.reset()

  items.forEach((item) => {
    const level = item.depth - minLevel
    const title = item.value.replace(/<[^>]*>?/gm, '')
    const newNode: Node = {
      url: `#${slugs.slug(title)}`,
      title: title,
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
      if (curNode[level - 1]) curNode[level - 1].children.push(newNode)
      newNode.parent = curNode[level - 1]
    }
  })

  return data
}

function bindHTMLElement (toc: Node[]): void {
  toc.forEach((i, idx, arr) => {
    if (i.element === null) arr[idx].element = document.getElementById(getIDfromHash(i.url))
    if (i.children) bindHTMLElement(i.children)
  })
}

const ToC: React.FC<Toc> = (props) => {
  const { toc, pathname } = props
  const items = toc
  const classes = useStyles()
  const theme = useTheme()
  const [settings] = useSetting()

  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const tabHeight = isMdDown ? 64 : 112
  const scrollPadding = 24

  const newItems = useRef(Tocize(items))
  const clickedRef = useRef(false)
  const unsetClickedRef = useRef(null)
  const [activeState, setActiveState] = useState<Node|null>(null)

  // eslint-disable-next-line
  useEffect(() => {
    bindHTMLElement(newItems.current)
  }, [items])

  const nodeSetActive = (node: Node|null, val: boolean): void => {
    for (let u = node; u !== null; u = u.parent) u.status = val ? 'expanded' : 'collapse'
    if (val && node) node.status = 'active'
  }
  const updateActive = (state: Node|null) : void => {
    nodeSetActive(activeState, false)
    nodeSetActive(state, true)
    setActiveState(state)
  }

  const newFindActiveItem = useCallback(() => {
    if (clickedRef.current) return
    function filter (u: Node): boolean {
      // console.log(tabHeight + scrollPadding, document.documentElement.clientHeight / 8)
      return u.element?.offsetParent?.offsetTop <
        document.documentElement.scrollTop + document.documentElement.clientHeight / 8 + 50
    }
    function findActive (toc: Node[]): Node|null {
      if (!toc) return null
      for (let i = toc.length - 1; i >= 0; i--) {
        if (filter(toc[i])) {
          const z = findActive(toc[i].children)
          if (z) return z
          else return toc[i]
        }
      }
      return null
    }
    const active = document.documentElement.scrollTop < 200 ? null : findActive(newItems.current)

    if (!(activeState?.url === active?.url)) {
      updateActive(active)
    }
  }, [activeState])

  useThrottledOnScroll(newFindActiveItem, 166)

  const handleClick = (item: Node) => (event) => {
    const hash = item.url
    if (settings.animation.smoothScroll) {
      event.preventDefault()
      // Used to disable findActiveIndex if the page scrolls due to a click
      const targetElement = document.getElementById(
        hash.substring(1, hash.length),
      )
      smoothScrollTo((targetElement?.offsetParent as any)?.offsetTop - tabHeight - scrollPadding)
      history.pushState(null, null, hash)
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
    () => () => {
      clearTimeout(unsetClickedRef.current)
    },
    [],
  )

  return (
    <nav className={classes.main} aria-label="pageTOC">
      {newItems.current.length > 0
        ? (
        <>
          <Typography gutterBottom className={classes.contents}>
            目录
          </Typography>
          <Toc data={newItems.current} onClick={handleClick} />
        </>
          )
        : null}
    </nav>
  )
}

export default React.memo(ToC, (prev, next) => prev.pathname === next.pathname)
