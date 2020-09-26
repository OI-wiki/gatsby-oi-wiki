import Backdrop from '@material-ui/core/Backdrop'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { fade, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import SearchIcon from '@material-ui/icons/Search'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'gatsby'
import useDarkMode from '../lib/useDarkMode'

import scrollbarStyle from '../styles/scrollbar'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  searchResultPrimary: {
    '& em': {
      fontStyle: 'normal',
      color: theme.palette.search.highlight,
      background: 'rgba(143,187,237,.1)',
    },
  },
  searchResultSecondary: {
    '& em': {
      fontStyle: 'normal',
      padding: '0 0 2px',
      boxShadow: 'inset 0 -2px 0 0 rgba(69,142,225,.8)',
      // 使用 box shadow 模拟下划线
    },
  },
  inputRoot: {
    color: 'inherit',
    display: 'block',
    // margin: theme.spacing(1, 1, 1, 0),
    marginLeft: `calc(1em + ${theme.spacing(4)}px)`,
    marginTop: '2px',
    marginBottom: '2px',
  },
  smallScreenInputRoot: {
    color: 'inherit',
    display: 'block',
    // margin: theme.spacing(1, 1, 1, 0),
    marginLeft: `calc(1em + ${theme.spacing(4)}px)`,
    marginTop: '9px',
    marginBottom: '6px',
  },
  inputInput: {
    // vertical padding + font size from searchIcon
    // width: '100%',
    [theme.breakpoints.up('md')]: {
      transition: theme.transitions.create('width'),
      width: '15vw',
      '&:focus': {
        width: '30vw',
      },
    },
    [`&::-webkit-search-decoration,
       &::-webkit-search-cancel-button,
       &::-webkit-search-results-button,
       &::-webkit-search-results-decoration`]: {
      display: 'none',
    },
  },
  wideInput: {
    [theme.breakpoints.up('md')]: {
      transition: theme.transitions.create('width'),
      width: '30vw',
    },
  },
  resultPaper: scrollbarStyle(theme, {
    marginTop: '12px',
    minWidth: `calc(30vw + 1em + ${theme.spacing(4)}px)`,
    maxWidth: '50vw',
    position: 'absolute',
    right: '0 !important',
    top: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: theme.zIndex.drawer + 2,
  }),
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    maxWidth: `calc(30vw + 1em + ${theme.spacing(4)}px)`,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    zIndex: theme.zIndex.drawer + 2,
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchColorBlack: {
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
  },
  searchColorWhite: {
    backgroundColor: fade(theme.palette.common.white, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchMessage: {
    padding: '8px 8px 8px 20px',
    backgroundColor: theme.palette.search.messageBackground,
  },
  smallScreenSearchIcon: {
    padding: theme.spacing(1.5),
    height: '100%',
    // position: 'absolute',
    // pointerEvents: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallScreenReturnIcon: {
    padding: theme.spacing(1.5),
    // padding: 0,
    // height: '100%',
    position: 'absolute',
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',

  },
  dialogHeader: {
    display: 'block',
    alignItems: 'center',
    '-webkit-border-radius': '0',
    '-moz-border-radius': '0',
    'border-radius': '0',
  },
}))

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
