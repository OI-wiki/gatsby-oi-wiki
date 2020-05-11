import Collapse from '@material-ui/core/Collapse'
import MuiLink from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme) => ({
  listitem: {
    color: theme.palette.text.primary,
    lineHeight: 1.2,
    paddingLeft: (props) => props.padding,
    ':hover': {
      textDecoration: 'none',
    },
  },
  oplistitem: {
    paddingLeft: (props) => props.padding,
    lineHeight: 1.2,
  },
  list: {
    width: '100%',
    height: '100%',
  },
}))

function Item (props, padding, pathname) {
  const classes = useStyles({ padding })
  const arr = Object.entries(props)[0]
  const key = arr[0]
  const value = arr[1]
  if (typeof value === 'string') {
    return [
      <ListItem
        button
        selected={value === pathname}
        component={MuiLink}
        href={value}
        key={key}
        className={classes.listitem}
      >
        <ListItemText
          primary={
            <Typography variant={'body2'} component={'span'}>
              {key}
            </Typography>
          }
        />
      </ListItem>,
      value === pathname,
    ]
  }
  // array
  const listItemsResult = value.map((item) =>
    Item(item, padding + 16, pathname),
  )
  const shouldOpen = listItemsResult.reduce(
    (prev, [, curr]) => curr || prev,
    false,
  )
  // eslint-disable-next-line
  const [open, setOpen] = useState(shouldOpen)
  const listItems = listItemsResult.map(([v]) => v)
  return [
    <div key={key}>
      <ListItem
        button
        onClick={() => setOpen(!open)}
        className={classes.oplistitem}
      >
        <ListItemText
          primary={
            <Typography variant={'body2'} component={'span'}>
              {key}
            </Typography>
          }
        />
        {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>{listItems}</List>
      </Collapse>
    </div>,
    shouldOpen,
  ]
}

function Sidebar (props) {
  const classes = useStyles()
  const pathList = props.pathList
  return (
    <List className={classes.list}>
      {pathList.map((item) => Item(item, 16, props.pathname))}
    </List>
  )
}

export default React.memo(Sidebar, (prev, next) => prev.pathname === next.pathname)
