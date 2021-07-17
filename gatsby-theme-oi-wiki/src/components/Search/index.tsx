import { Backdrop, Dialog, IconButton, InputBase, Paper } from '@material-ui/core'
import { ArrowBack as ArrowBackIcon, Search as SearchIcon } from '@material-ui/icons'

import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import useDarkMode from '../../lib/useDarkMode'

import { useStyles } from './styles'
import SearchResultList from './ResultList'
import { useDebounce, useWindowDimensions } from './hooks'

/**
 * 从 API 获取搜索数据
 * @param str 要搜索的内容
 * TODO: 补全此处的类型
 */
const fetchResult = (str: string): Promise<any> => fetch(
  `https://search.oi-wiki.org:8443/?s=${encodeURIComponent(str)}`,
  {
    // credentials: "same-origin"
  },
)
  .then((response) => response.json())

const Search: React.FC = () => {
  const [searchKey, setSearchKey] = useState('')
  const [result, setResult] = useState([])
  const [open, setOpen] = useState(false)
  const debouncedKey = useDebounce(searchKey, 500)
  const classes = useStyles()

  const isFirstRun = useRef(true)

  const enableDark = useDarkMode()
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (debouncedKey !== '') {
      fetchResult(debouncedKey).then((val) => {
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

  // 600px is sm
  if (width > 600) {
    return <>
      <div
        className={clsx(
          classes.search,
          enableDark
            ? classes.searchColorBlack
            : (
                open ? classes.searchColorWhite : classes.searchColorBlack
              ),
        )}
      >
        <div className={classes.searchIcon}>
          <SearchIcon fontSize="small"/>
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
  } else {
    return <>
      <IconButton onClick={() => {
        setOpen(true)
      }} className={classes.smallScreenSearchIcon}>
        <SearchIcon/>
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
          <IconButton className={classes.smallScreenReturnIcon} onClick={() => {
            setOpen(false)
          }}>
            <ArrowBackIcon/>
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
  }
}

export default Search
