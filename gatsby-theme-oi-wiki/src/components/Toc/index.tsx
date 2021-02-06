import { Link as MuiLink, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import smoothScrollTo from '../../lib/smoothScroll'
import useThrottledOnScroll from '../../lib/useThrottledOnScroll'
import { useStyles } from './styles'

function getIDfromURL (url:string):string {
  return url?.substring(1, url.length)
}

function getItems(items: Item[]): itemsResult[] {
  const minLevel = items.reduce((v, i) => Math.min(v, i.level), 5);
  items.forEach(i => { i.level = i.level - minLevel + 1 })
  const itemsResult = items.map((i): itemsResult => ({...i}));
  return itemsResult
}

interface itemsResult{
  url: string;
  title: string;
  level: number;
  node?: any;
}
interface Item{
  url: string,
  title: string;
  items?: Item[];
  level: number;
}
interface Toc{
  pathname: string;
  toc: {
    items: Item[];
  }
}

const ToC: React.FC<Toc> = (props) => {
  const { toc, pathname } = props
  const items = toc.items
  const classes = useStyles()
  const itemsClientRef = useRef(getItems(items))
  // eslint-disable-next-line
  useEffect(() => {
    itemsClientRef.current =
      itemsClientRef.current.map(
        i => {
          i.node = document.getElementById(getIDfromURL(i.url))
          return i
        })
  }, [items])
  const [activeState, setActiveState] = useState('')
  const clickedRef = useRef(false)
  const unsetClickedRef = useRef(null)
  const findActiveItem = useCallback(() => {
    if (clickedRef.current) {
      return
    }

    let active: any
    for (let i = itemsClientRef.current.length - 1; i >= 0; i -= 1) {
      // No hash if we're near the top of the page
      if (document.documentElement.scrollTop < 200) {
        active = { url: null }
        break
      }

      const item = itemsClientRef.current[i]
      if (
        item.node &&
        item.node.offsetTop <
          document.documentElement.scrollTop +
            document.documentElement.clientHeight / 8
      ) {
        active = item
        break
      }
    }

    if (active && activeState !== active.url) {
      setActiveState(active.url)
    }
  }, [activeState])
  useThrottledOnScroll(findActiveItem, 166)
  const handleClick = (hash) => (event) => {
    // Ignore click for new tab/new window behavior
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return
    }
    event.preventDefault()
    // Used to disable findActiveIndex if the page scrolls due to a click
    const targetElement = document.getElementById(
      hash.substring(1, hash.length),
    )
    smoothScrollTo(targetElement.offsetTop)
    history.pushState(null, null, hash)
    clickedRef.current = true
    unsetClickedRef.current = setTimeout(() => {
      clickedRef.current = false
    }, 1000)

    if (activeState !== hash) {
      setActiveState(hash)
    }
  }

  useEffect(
    () => () => {
      clearTimeout(unsetClickedRef.current)
    },
    [],
  )

  const itemLink: React.FC<{ item: Item, secondary?: boolean}> = ({ item, secondary }) => (
    <MuiLink
      display="block"
      color={activeState === item.url ? 'textPrimary' : 'textSecondary'}
      href={`${pathname}${item.url}`}
      underline="none"
      onClick={handleClick(item.url)}
      className={clsx(
        classes.item,
        { [classes.secondaryItem]: secondary },
        activeState === item.url ? classes.active : undefined,
      )}
    >
      <span dangerouslySetInnerHTML={{ __html: item.title }} />
    </MuiLink>
  )
  return (
    <nav className={classes.main} aria-label="pageTOC">
      {items.length > 0 ? (
        <>
          <Typography gutterBottom className={classes.contents}>
            目录
          </Typography>
          <Typography component="ul" className={classes.ul}>
            {items.map((item2) => (
              item2.level <= 2
                ? <li key={item2.title}>
                  {itemLink({ item: item2, secondary: item2.level !== 1 })}
                </li> : null
            ))}
          </Typography>
        </>
      ) : null}
    </nav>
  )
}

export default React.memo(ToC, (prev, next) => prev.pathname === next.pathname)
