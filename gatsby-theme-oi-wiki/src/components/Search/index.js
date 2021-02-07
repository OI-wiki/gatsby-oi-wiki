import {
  Backdrop, 
  Dialog, 
  IconButton, 
  InputBase,
  Paper,
} from '@material-ui/core'
import { ArrowBack as ArrowBackIcon, Search as SearchIcon } from '@material-ui/icons'

import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import useDarkMode from '../../lib/useDarkMode'

import { useStyles } from './styles'
import { SearchResultList } from './ResultList';

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
        <IconButton onClick={() => { setOpen(true) }} className={classes.smallScreenSearchIcon}>
          <SearchIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false)
          }}
          fullWidth={true}
          fullScreen
        >
          <Paper component="div" className={classes.dialogHeader}>
            <IconButton className={classes.smallScreenReturnIcon} onClick={() => { setOpen(false) }} >
              <ArrowBackIcon />
            </IconButton>
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
