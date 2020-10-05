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
    '&:hover': {
      textDecoration: 'none',
    },
  },
  oplistitem: {
    lineHeight: 1.2,
  },
  list: {
    width: '100%',
    height: '100%',
  },
}))

enum NodeType {
  Leaf, NonLeaf
}

type PathListType = Array<Record<string, string> | Array<PropsType>>

type PropsType = {
  pathList: PathListType,
  pathname: string
}

interface PathListLeafNode {
  name: string,
  type: NodeType
  path: string
}

interface PathListNonLeafNode {
  name: string,
  type: NodeType,
  children: Array<PathListNode>
}

type PathListNode = PathListLeafNode | PathListNonLeafNode

type TypedPathList = Array<PathListNode>

function Item (node: PathListNode, padding: number, pathname: string): [React.ReactElement, boolean] {
  const classes = useStyles()
  const name = node.name
  if (node.type === NodeType.Leaf) {
    const url = (node as PathListLeafNode).path
    return [
      <ListItem
        button
        selected={url === pathname}
        component={MuiLink}
        href={url}
        key={name}
        className={classes.listitem}
        style={{ paddingLeft: `${padding}px` }}
      >
        <ListItemText
          primary={
            <Typography variant="body2" component="span">
              {name}
            </Typography>
          }
        />
      </ListItem>,
      url === pathname,
    ]
  }
  // array
  const children = (node as PathListNonLeafNode).children
  const listItemsResult = children.map((item) =>
    Item(item, padding + 16, pathname),
  )

  let shouldOpen = false
  for (const [, i] of listItemsResult) {
    shouldOpen = shouldOpen || i
  }

  // eslint-disable-next-line
  const [open, setOpen] = useState(shouldOpen)
  const listItems = listItemsResult.map(([v]) => v)
  return [
    <div key={name}>
      <ListItem
        button
        onClick={() => setOpen(!open)}
        className={classes.oplistitem}
        style={{ paddingLeft: `${padding}px` }}
      >
        <ListItemText
          primary={
            <Typography variant="body2" component="span">
              {name}
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

function getTypedPathList (pathList: PathListType): TypedPathList {
  const resArray: TypedPathList = []
  for (const i of pathList) {
    const [[name, a]] = Object.entries(i)
    if (typeof a === 'string') {
      resArray.push({ name, path: a, type: NodeType.Leaf })
    } else {
      resArray.push({ name, children: getTypedPathList(a), type: NodeType.NonLeaf })
    }
  }
  return resArray
}

const Sidebar: React.FC<PropsType> = (props) => {
  const classes = useStyles()
  const pathList = props.pathList
  const typedPathList = getTypedPathList(pathList)
  const res = typedPathList.map((item) => Item(item, 16, props.pathname)).map(([x]) => x)
  return (
    <List className={classes.list}>
      {res}
    </List>
  )
}

export default React.memo(Sidebar, (prev, next) => prev.pathname === next.pathname)
// 只比较 pathname，而不比较 pathList，考虑到当 pathList 不同时，pathname 也一定不同，因此这样比较可以节省计算量
