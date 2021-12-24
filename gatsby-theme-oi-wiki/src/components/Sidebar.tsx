import { Collapse, List, ListItem, ListItemText, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'gatsby';
import trimTrailingSlash from '../lib/trailingSlash';

const useStyles = makeStyles((theme) => ({
  listItem: {
    color: theme.palette.text.primary,
    lineHeight: 1.2,
    '&:hover': {
      textDecoration: 'none',
    },
    paddingTop: 5,
    paddingBottom: 5,
  },
  opListItem: {
    lineHeight: 1.2,
    paddingTop: 5,
    paddingBottom: 5,
  },
  list: {
    width: '100%',
    height: '100%',
  },
}));

enum NodeType {
  Leaf, NonLeaf
}

interface PathListLeafNode {
  name: string;
  type: NodeType.Leaf;
  path: string;
}

interface PathListNonLeafNode {
  name: string;
  type: NodeType.NonLeaf;
  children: Array<PathListNode>;
}

type PathListNode = PathListLeafNode | PathListNonLeafNode

type TypedPathList = Array<PathListNode>

interface LeafItemProps extends PathListLeafNode {
  padding: number;
  selected: boolean;
}

interface NonLeafItemProps extends Omit<PathListNonLeafNode, 'children'> {
  padding: number;
  childItems: React.ReactElement[];
  isOpen: boolean;
}

type PathListType = Array<Record<string, string> | Array<SidebarProps>>

export interface SidebarProps {
  pathList: PathListType,
  pathname: string
}

const NonLeafItem: React.FC<NonLeafItemProps> = (props) => {
  const classes = useStyles();
  const { name, padding, childItems, isOpen } = props;
  const [open, setOpen] = useState(isOpen);

  return <div>
    <ListItem
      button={true}
      onClick={() => setOpen(!open)}
      className={classes.opListItem}
      style={{ paddingLeft: `${padding}px` }}
    >
      <ListItemText
        primary={
          <Typography variant="body2" component="span">
            {name}
          </Typography>
        }
      />
      {open ? <ExpandLessIcon fontSize="small"/> : <ExpandMoreIcon fontSize="small"/>}
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List disablePadding>{childItems}</List>
    </Collapse>
  </div>;
};

const LeafItem: React.FC<LeafItemProps> = (props) => {
  const classes = useStyles();
  const { name, path, padding, selected } = props;

  return <Link key={name} to={path}>
    <ListItem
      button={true}
      selected={selected}
      className={classes.listItem}
      style={{ paddingLeft: `${padding}px` }}
    >
      <ListItemText
        primary={
          <Typography variant="body2" component="span">
            {name}
          </Typography>
        }
      />
    </ListItem>
  </Link>;
};

function Item(node: PathListNode, padding: number, pathname: string): [React.ReactElement, boolean] {
  if (node.type === NodeType.Leaf) {
    const selected = trimTrailingSlash(node.path) === trimTrailingSlash(pathname);
    return [
      <LeafItem key={node.path} padding={padding} selected={selected} {...node}/>,
      selected,
    ];
  } else {
    const children = node.children;
    let isOpen = false;
    const items: NonLeafItemProps['childItems'] = [];

    children.forEach((v) => {
      const [item, selected] = Item(v, padding + 16, pathname);
      if (selected) isOpen = selected;
      items.push(item);
    });

    return [
      <NonLeafItem key={node.name} isOpen={isOpen} childItems={items} padding={padding} {...node} />,
      isOpen,
    ];
  }
}

function getTypedPathList(pathList: PathListType): TypedPathList {
  const resArray: TypedPathList = [];
  for (const i of pathList) {
    const [[name, a]] = Object.entries(i);
    if (typeof a === 'string') {
      resArray.push({ name, path: a, type: NodeType.Leaf });
    } else {
      resArray.push({ name, children: getTypedPathList(a), type: NodeType.NonLeaf });
    }
  }
  return resArray;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const classes = useStyles();
  const pathList = props.pathList;
  const typedPathList = getTypedPathList(pathList);
  const res = typedPathList
    .map((item) => Item(item, 16, props.pathname))
    .map(([x]) => x);
  return (
    <List className={classes.list}>
      {res}
    </List>
  );
};

// 只比较 pathname，而不比较 pathList，考虑到当 pathList 不同时，pathname 也一定不同，因此这样比较可以节省计算量
export default React.memo(Sidebar, (prev, next) => prev.pathname === next.pathname);
