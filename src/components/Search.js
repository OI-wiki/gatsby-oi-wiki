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
import React, { useState } from 'react'
import { MdSearch } from 'react-icons/md'

import scrollbarStyle from '../styles/scrollbar'

const useStyles = makeStyles({})

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  searchResultPrimary: {
    '& em': {
      fontStyle: 'normal',
      color: fade(theme.palette.primary.main, 0.95),
      background: fade(theme.palette.primary.main, 0.08)
    }
  },
  searchResultSecondary: {
    '& em': {
      fontStyle: 'normal',
      padding: '0 0 2px',
      boxShadow: `inset 0 -2px 0 0 ${fade(theme.palette.primary.main, 0.5)}`
      // 使用 box shadow 模拟下划线
    }
  },
  inputRoot: {
    color: 'inherit'
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
        width: '30vw'
      }
    }
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
    zIndex: theme.zIndex.drawer + 2
  }),
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
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
      width: 'auto'
    }
  },
  searchColorBlack: {
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25)
    }
  },
  searchColorWhite: {
    backgroundColor: fade(theme.palette.common.white, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.common.white
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchMessage: {
    padding: '8px 8px 8px 20px',
    backgroundColor: grey[100]
  }
})

function SearchResultList (props) {
  const { val, searched, ev, classes } = props
  const valcount = val.length
  return valcount !== 0 ? (
    <>
      <Typography variant="body1" className={classes.searchMessage}>
        共找到 {valcount} 条搜索结果：
      </Typography>
      <List>
        {val.map((item) => {
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
                primary={
                  <Typography
                    variant="h6"
                    className={classes.searchResultPrimary}
                    dangerouslySetInnerHTML={{
                      __html: item.title.replace(ev, `<em>${ev}</em>`)
                    }}
                  />
                }
                secondary={
                  <div
                    className={classes.searchResultSecondary}
                    dangerouslySetInnerHTML={{
                      __html: item.highlight ? item.highlight : ''
                    }}
                  />
                }
              />
            </ListItem>
          )
        })}
      </List>
    </>
  ) : searched ? (
    <Typography variant={'body1'} className={classes.searchMessage}>
      没有找到符合条件的结果
    </Typography>
  ) : (
    ''
  )
}

class Result extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ev: '',
      val: [],
      searched: false,
      open: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  update (ev) {
    clearTimeout(this.timer)
    this.setState({
      ev: ev.target.value
    })
    // this.timer = setTimeout(this.handleChange, 0)
    if (ev !== '') this.timer = setTimeout(this.handleChange, 500)
  }

  handleChange (w) {
    const { ev } = this.state

    // const sta = []
    // let Rsize
    const result = fetch(
      `https://search.oi-wiki.org:8443/?s=${encodeURIComponent(ev)}`,
      {
        // credentials: "same-origin"
      }
    )
      .then((response) => response.json())
      .then((result) => {
        // Rsize = result.length
        return result
      })

    result.then((val) =>
      this.setState({
        val: val,
        searched: true
      })
    )
  }

  render () {
    const { ev, val, searched, open } = this.state
    return (
      <>
        <div
          className={clsx(
            this.props.classes.search,
            open
              ? this.props.classes.searchColorWhite
              : this.props.classes.searchColorBlack
          )}
        >
          <div className={this.props.classes.searchIcon}>
            <MdSearch />
          </div>
          <InputBase
            type="search"
            placeholder="键入以开始搜索"
            onChange={this.update.bind(this)}
            onFocus={() => {
              this.setState({ open: true })
            }}
            classes={{
              root: this.props.classes.inputRoot,
              input: this.props.classes.inputInput
            }}
          />
          {open && (
            <Paper className={this.props.classes.resultPaper}>
              <SearchResultList
                ev={ev}
                val={val}
                searched={searched}
                classes={this.props.classes}
              />
            </Paper>
          )}
        </div>
        <Backdrop
          className={this.props.classes.backdrop}
          open={open}
          onClick={() => {
            this.setState({ open: false })
          }}
        />
      </>
    )
  }
}

// eslint-disable-next-line no-unused-vars
function Search (props) {
  const [dialogOpen, setDialogOpen] = useState(true)
  const classes = useStyles()
  return (
    <>
      <IconButton
        onClick={() => setDialogOpen(true)}
        className={classes.iconButton}
      >
        <MdSearch fontSize="medium" />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
        }}
        fullWidth={true}
      >
        <DialogTitle>{'搜索'}</DialogTitle>
        <DialogContent>
          <Result classes={props.classes} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(Result)
