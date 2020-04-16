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
import { MdSearch } from 'react-icons/md'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
                      __html: item.title.replace(searchKey, `<em>${searchKey}</em>`),
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

function Result () {
  const [searchKey, setSearchKey] = useState('')
  const [result, setResult] = useState([])
  const [open, setOpen] = useState(false)
  const debouncedKey = useDebounce(searchKey, 500)
  const classes = useStyles()

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
    } else {
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

        result.then((val) =>
          setResult(val))
      } else {
        setResult([])
      }
    }
  }, [debouncedKey])

  return (
    <>
      <div
        className={clsx(
          classes.search,
          open
            ? classes.searchColorWhite
            : classes.searchColorBlack,
        )}
      >
        <div className={classes.searchIcon}>
          <MdSearch />
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
}

// class Result extends React.Component {
//   constructor(props) {
//     super(props);
//     console.log(props);
//     this.state = {
//       ev: "",
//       val: [],
//       searched: false,
//       open: false,
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   update(ev) {
//     clearTimeout(this.timer);
//     this.setState({
//       ev: ev.target.value,
//     });
//     // this.timer = setTimeout(this.handleChange, 0)
//     if (ev !== "") this.timer = setTimeout(this.handleChange, 500);
//   }

//   handleChange(w) {
//     const { ev } = this.state;

//     // const sta = []
//     // let Rsize
//     const result = fetch(
//       `https://search.oi-wiki.org:8443/?s=${encodeURIComponent(ev)}`,
//       {
//         // credentials: "same-origin"
//       }
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         // Rsize = result.length
//         return result;
//       });

//     result.then((val) =>
//       this.setState({
//         val: val,
//         searched: true,
//       })
//     );
//   }

//   updateDimensions = () => {
//     this.setState({ width: window.innerWidth, height: window.innerHeight });
//   };

//   componentDidMount() {
//     window.addEventListener("resize", this.updateDimensions);
//   }
//   componentWillUnmount() {
//     window.removeEventListener("resize", this.updateDimensions);
//   }

//   render() {
//     const { ev, val, searched, open, width } = this.state;
//     // const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));
//     // console.log(matches);
//     // console.log(width);
//     // console.log(useScreenWidth());
//     // const isDesktop = useMediaQuery(theme => theme.breakpoints.up('lg'), {
//     //   defaultMatches: true,
//     // });

//     // console.log(isDesktop);
//     return (
//       <>
//         <Hidden smDown implementation={"css"}>
//           <div
//             className={clsx(
//               this.props.classes.search,
//               open
//                 ? this.props.classes.searchColorWhite
//                 : this.props.classes.searchColorBlack
//             )}
//           >
//             <div className={this.props.classes.searchIcon}>
//               <MdSearch />
//             </div>
//             <InputBase
//               type="search"
//               placeholder="键入以开始搜索"
//               onChange={this.update.bind(this)}
//               onFocus={() => {
//                 this.setState({ open: true });
//               }}
//               classes={{
//                 root: this.props.classes.inputRoot,
//                 input: this.props.classes.inputInput,
//               }}
//             />
//             {open && (
//               <Paper className={this.props.classes.resultPaper}>
//                 <SearchResultList
//                   ev={ev}
//                   val={val}
//                   searched={searched}
//                   classes={this.props.classes}
//                 />
//               </Paper>
//             )}
//           </div>
//           <Backdrop
//             className={this.props.classes.backdrop}
//             open={open}
//             onClick={() => {
//               this.setState({ open: false });
//             }}
//           />
//         </Hidden>
//         <Hidden smUp implementation={"css"}>
//           <div
//             className={clsx(
//               this.props.classes.search,
//               open
//                 ? this.props.classes.searchColorWhite
//                 : this.props.classes.searchColorBlack,
//               this.props.classes.smallScreen
//             )}
//           >
//             <IconButton onClick={() => this.setState({ open: true })}>
//               <MdSearch />
//             </IconButton>
//             <Dialog
//               open={this.state.open}
//               onClose={() => {
//                 this.setState({ open: false });
//               }}
//               fullWidth={true}
//             >
//               <InputBase
//                 type="search"
//                 placeholder="键入以开始搜索"
//                 onChange={this.update.bind(this)}
//                 classes={{
//                   root: this.props.classes.inputRoot,
//                   input: this.props.classes.inputInput,
//                 }}
//               />

//               <SearchResultList
//                 ev={ev}
//                 val={val}
//                 searched={searched}
//                 classes={this.props.classes}
//               />
//             </Dialog>
//           </div>
//         </Hidden>
//       </>
//     );
//   }
// }

export default Result
// export default withStyles(styles)(withMediaQuery("(min-width:400px)")(Result));
