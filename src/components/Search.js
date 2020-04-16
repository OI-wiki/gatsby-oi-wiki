import Hidden from '@material-ui/core/Hidden'
import Backdrop from '@material-ui/core/Backdrop'
import grey from '@material-ui/core/colors/grey'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { fade, makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import clsx from 'clsx'
import React, { useState, useEffect, useRef } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import SearchIcon from '@material-ui/icons/Search'

import scrollbarStyle from '../styles/scrollbar'

const withMediaQuery = (...args) => (Component) => (props) => {
  const mediaQuery = useMediaQuery(...args)
  return <Component mediaQuery={mediaQuery} {...props} />
}

function useScreenWidth () {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handler = (event) => {
      setWidth(event.target.innerWidth)
    }

    window.addEventListener('resize', handler)

    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return width
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  searchResultPrimary: {
    '& em': {
      fontStyle: 'normal',
      color: fade(theme.palette.primary.main, 0.95),
      background: fade(theme.palette.primary.main, 0.08),
    },
  },
  searchResultSecondary: {
    '& em': {
      fontStyle: 'normal',
      padding: '0 0 2px',
      boxShadow: `inset 0 -2px 0 0 ${fade(theme.palette.primary.main, 0.5)}`,
      // 使用 box shadow 模拟下划线
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '15vw',
      '&:focus': {
        width: '30vw',
      },
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
    [theme.breakpoints.up('sm')]: {
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
    backgroundColor: grey[100],
  },
  smallScreen: {
    visibility: 'visible',
    [theme.breakpoints.up('sm')]: {
      visibility: 'hidden',
    },
  },
  bigScreen: {
    visibility: 'hidden',
    [theme.breakpoints.down('sm')]: {
      visibility: 'visible',
    },
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
              component="a"
              href={item.url}
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
    <Typography variant={'body1'} className={classes.searchMessage}>
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
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
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
    if (searchKey !== '') {
      const result = fetch(
        `https://search.oi-wiki.org:8443/?s=${encodeURIComponent(searchKey)}`,
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

  const { height, width } = useWindowDimensions()
  // console.log(`width: ${width} ~ height: ${height}`);

  if (width > 1300) {
    return (
      <>
        <div
          className={clsx(
            classes.search,
            open ? classes.searchColorWhite : classes.searchColorBlack,
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
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
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
        <div
          className={clsx(
            classes.search,
            open ? classes.searchColorWhite : classes.searchColorBlack,
          )}
        >
          <div className={classes.searchIcon} >
            <IconButton onClick={() => setOpen(true)}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </div>
          <Dialog
            open={open}
            onClose={() => {
              setOpen(false)
            }}
            fullWidth={true}
          >
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
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
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
          </Dialog>
        </div>
      </>
    )
  }
}
export default Result
