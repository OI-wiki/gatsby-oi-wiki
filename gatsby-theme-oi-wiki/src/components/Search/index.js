import {
  Backdrop, 
  Dialog, 
  IconButton, 
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@material-ui/core'

import { ArrowBack as ArrowBackIcon, FindInPage as FindInPageIcon, Search as SearchIcon } from '@material-ui/icons'

import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'gatsby'
import useDarkMode from '../../lib/useDarkMode'

import { useStyles } from './styles'

function SearchResultList (props) {
  const { result, isFirstRun, searchKey, classes } = props
  const resultCount = result.length
  return resultCount !== 0 ? (
    <>
      <Typography variant="body1" className={classes.searchMessage}>
        共找到 {resultCount} 条搜索结果：
      </Typography>
      <List>
        {result.map((item) => {
          /* Render article */
          return (
            <ListItem
              button
              divider
              component={Link}
              to={item.url}
              state={{ searchKey: searchKey }}
              key={item.url}
            >
              <ListItemIcon>
                <FindInPageIcon />
              </ListItemIcon>
              <ListItemText
                disableTypography={true}
                primary={
                  <Typography
                    variant="h6"
                    className={classes.searchResultPrimary}
                    dangerouslySetInnerHTML={{
                      __html: item.title.replace(
                        searchKey,
                        `<em>${searchKey}</em>`,
                      ),
                    }}
                  />
                }
                secondary={
                  <div
                    className={classes.searchResultSecondary}
                    dangerouslySetInnerHTML={{
                      __html: item.highlight ? item.highlight : '',
                    }}
                  />
                }
              />
            </ListItem>
          )
        })}
      </List>
    </>
  ) : !isFirstRun.current ? (
    <Typography variant="body1" className={classes.searchMessage}>
      没有找到符合条件的结果
    </Typography>
  ) : (
        ''
      )
}

function useDebounce (value, timeout) {
  const [state, setState] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout)

    return () => clearTimeout(handler)
  }, [value, timeout])

  return state
}

function useWindowDimensions () {
  // function getWindowDimensions() {
  //   const { innerWidth: width, innerHeight: height } = window;
  //   return {
  //     width,
  //     height
  //   };
  // }

  const [windowDimensions, setWindowDimensions] = useState({
    width: null,
    height: null,
  })
  // const [windowDimensions, setWindowDimensions] = useState({width: window.innerWidth, height: window.innerHeight});

  useEffect(() => {
    function handleResize () {
      // console.log('updated window')
      setWindowDimensions({
        width: window.innerWidth,
        // height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

function Result () {
  const [searchKey, setSearchKey] = useState('')
  const [result, setResult] = useState([])
  const [open, setOpen] = useState(false)
  const debouncedKey = useDebounce(searchKey, 500)
  const classes = useStyles()

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (debouncedKey !== '') {
      const result = fetch(
        `https://search.oi-wiki.org:8443/?s=${encodeURIComponent(debouncedKey)}`,
        {
          // credentials: "same-origin"
        },
      )
        .then((response) => response.json())
        .then((result) => {
          // Rsize = result.length
          return result
        })

      result.then((val) => {
        // the order is tricky here
        // set result after set isFirstRun
        // so when there's no result on first run
        // the user is prompted with the notice
        isFirstRun.current = false
        setResult(val)
      })
    } else {
      setResult([])
    }
  }, [debouncedKey])

  const enableDark = useDarkMode()
  const { width } = useWindowDimensions()
  // console.log(`width: ${width} ~ height: ${height}`);

  // 600px is sm
  if (width > 600) {
    return (
      <>
        <div
          className={clsx(
            classes.search,
            enableDark ? classes.searchColorBlack : (
              open ? classes.searchColorWhite : classes.searchColorBlack
            ),
          )}
        >
          <div className={classes.searchIcon}>
            <SearchIcon fontSize="small" />
          </div>
          <InputBase
            type="search"
            placeholder="键入以开始搜索"
            onChange={(ev) => {
              setSearchKey(ev.target.value)
            }}
            onFocus={() => {
              setOpen(true)
            }}
            classes={{
              root: clsx(classes.inputRoot, searchKey && classes.wideInput),
              input: classes.inputInput,
            }}
            defaultValue={searchKey}
          />
          {open && (
            <Paper className={classes.resultPaper}>
              <SearchResultList
                searchKey={searchKey}
                result={result}
                isFirstRun={isFirstRun}
                classes={classes}
              />
            </Paper>
          )}
        </div>
        <Backdrop
          className={classes.backdrop}
          open={open}
          onClick={() => {
            setOpen(false)
          }}
        />
      </>
    )
  } else {
    return (
      <>

        {/* <div  > */}
        <IconButton onClick={() => { setOpen(true) }} className={classes.smallScreenSearchIcon}>
          <SearchIcon />
        </IconButton>
        {/* </div> */}
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false)
          }}
          fullWidth={true}
          fullScreen

        >
          <Paper component="div" className={classes.dialogHeader}>

            {/* <div > */}
            <IconButton className={classes.smallScreenReturnIcon} onClick={() => { setOpen(false) }} >
              <ArrowBackIcon />

            </IconButton>
            {/* </div> */}
            <InputBase
              type="search"
              placeholder="键入以开始搜索"
              onChange={(ev) => {
                setSearchKey(ev.target.value)
              }}
              // onFocus={() => {
              //   setOpen(true)
              // }}
              classes={{
                root: classes.smallScreenInputRoot,
                input: classes.inputInput,
              }}
              autoFocus
              defaultValue={searchKey}
            />
          </Paper>
          {open && (
            <SearchResultList
              searchKey={searchKey}
              result={result}
              isFirstRun={isFirstRun}
              classes={classes}
            />
          )}
        </Dialog>
      </>
    )
  }
}
export default Result
