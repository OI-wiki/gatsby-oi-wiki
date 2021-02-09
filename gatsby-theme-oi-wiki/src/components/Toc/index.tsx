import { Link as MuiLink, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import smoothScrollTo from '../../lib/smoothScroll'
import useThrottledOnScroll from '../../lib/useThrottledOnScroll'
import { useStyles } from './styles'

function getIDfromURL (url:string):string {
  return url?.substring(1, url.length)
}

function getItems (items: Item[]): itemsResult[] {
  const minLevel = items.reduce((v, i) => Math.min(v, i.level), 5)
  const itemsResult = items.map((i): itemsResult => ({ ...i, level: i.level - minLevel + 1 }))
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
    itemsClientRef.current = itemsClientRef.current.map(i => ({
      ...i, node: document.getElementById(getIDfromURL(i.url)),
    }))
  }, [items])
  const [activeState, setActiveState] = useState('')
  const clickedRef = useRef(false)
  const unsetClickedRef = useRef(null)
  const findActiveItem = useCallback(() => {
    if (clickedRef.current) {
      return
    }

    const active: any = document.documentElement.scrollTop < 200
      ? { url: null } // No hash if we're near the top of the page
      : itemsClientRef.current.find(item =>
        item.node?.offsetTop < document.documentElement.scrollTop + document.documentElement.clientHeight / 8,
      )

    if (active && activeState !== active.url) {
      setActiveState(active.url)
    }
  }, [activeState])
  useThrottledOnScroll(findActiveItem, 166)
  const handleClick = (hash) => (event) => {
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
      {itemsClientRef.current.length > 0 ? (
        <>
          <Typography gutterBottom className={classes.contents}>
            目录
          </Typography>
          <Typography component="ul" className={classes.ul}>
            {itemsClientRef.current.map((item2) => (
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
