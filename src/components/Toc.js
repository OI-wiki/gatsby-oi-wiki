/** @jsx jsx */
import { jsx } from "theme-ui"
import { useEffect, useMemo, useCallback, useRef, useState } from "react"
import React from "react"
import throttle from "lodash/throttle"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import clsx from "clsx"
import MuiLink from "@material-ui/core/Link"

const useStyles = makeStyles((theme) => ({
  main: {
    top: theme.spacing(5),
    right: 0,
    marginTop: theme.spacing(5),
    width: "20%",
    flexShrink: 0,
    position: "fixed",
    height: "calc(100vh - 70px)",
    overflowY: "auto",
    padding: theme.spacing(2, 2, 2, 0),
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
    },
  },
  contents: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
  },
  ul: {
    padding: 0,
    margin: 0,
    listStyle: "none",
  },
  item: {
    fontSize: 13,
    padding: theme.spacing(0.5, 0, 0.5, 1),
    borderLeft: "4px solid transparent",
    boxSizing: "content-box",
    "&:hover": {
      borderLeft: `4px solid ${
        theme.palette.type === "light"
          ? theme.palette.grey[200]
          : theme.palette.grey[900]
      }`,
    },
    "&$active,&:active": {
      borderLeft: `4px solid ${
        theme.palette.type === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[800]
      }`,
    },
  },
  secondaryItem: {
    paddingLeft: theme.spacing(2.5),
  },
}))

const noop = () => {}

function useThrottledOnScroll(callback, delay) {
  const throttledCallback = useMemo(
    () => (callback ? throttle(callback, delay) : noop),
    [callback, delay]
  )

  useEffect(() => {
    if (throttledCallback === noop) {
      return undefined
    }

    window.addEventListener("scroll", throttledCallback)
    return () => {
      window.removeEventListener("scroll", throttledCallback)
      throttledCallback.cancel()
    }
  }, [throttledCallback])
}

function getIDfromURL(url) {
  return url.substring(1, url.length)
}

function getItems(items) {
  const itemsResult = []
  items.forEach((item2) => {
    itemsResult.push({
      url: item2.url,
      title: item2.title,
      node: document.getElementById(getIDfromURL(item2.url)),
    })
    if (item2.items) {
      item2.items.forEach((item3) => {
        itemsResult.push({
          ...item3,
          node: document.getElementById(getIDfromURL(item3.url)),
        })
      })
    }
  })
  return itemsResult
}

export default function ToC(props) {
  const { toc, key, pathname } = props
  const items = toc.items
  const classes = useStyles()
  const itemsClientRef = useRef([])
  useEffect(() => {
    itemsClientRef.current = getItems(items)
  }, items)
  const [activeState, setActiveState] = useState("")
  const clickedRef = useRef(false)
  const unsetClickedRef = useRef(null)
  const findActiveItem = useCallback(() => {
    if (clickedRef.current) {
      return
    }

    let active
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

    // Used to disable findActiveIndex if the page scrolls due to a click
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
    []
  )

  const itemLink = (item, secondary) => (
    <MuiLink
      display="block"
      color={activeState === item.url ? "textPrimary" : "textSecondary"}
      href={`${pathname}${item.url}`}
      underline="none"
      onClick={handleClick(item.url)}
      className={clsx(
        classes.item,
        { [classes.secondaryItem]: secondary },
        activeState === item.url ? classes.active : undefined
      )}
    >
      <span dangerouslySetInnerHTML={{ __html: item.title }} />
    </MuiLink>
  )
  return (
    <nav className={classes.main} aria-label={"pageTOC"}>
      {items.length > 0 ? (
        <>
          <Typography gutterBottom className={classes.contents}>
            {"目录"}
          </Typography>
          <Typography component="ul" className={classes.ul}>
            {items.map((item2) => (
              <li key={item2.title}>
                {itemLink(item2)}
                {item2.items && item2.items.length > 0 ? (
                  <ul className={classes.ul}>
                    {item2.items.map((item3) => (
                      <li key={item3.title}>{itemLink(item3, true)}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </Typography>
        </>
      ) : null}
    </nav>
  )
}
