import { css } from '@emotion/react'
import styled from '@mui/material/styles/styled'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import React, { useState } from 'react'
import { Link } from 'gatsby'
import trimTrailingSlash from '../lib/trailingSlash'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import { headerStore } from '../stores/headerStore'
import { navSidebarStore } from '../stores/sidebarStore'
import { observer } from 'mobx-react-lite'
import IconButton from '@mui/material/IconButton'
import FormatIndentDecreaseSharp from '@mui/icons-material/FormatIndentDecreaseSharp'
import FormatIndentIncreaseSharp from '@mui/icons-material/FormatIndentIncreaseSharp'
import { StrIndexObj } from '../types/common'
import { flattenObject } from './NavAndDrawer/utils'
import pathList from '../sidebar.yaml'

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

type PathListType = Array<Record<string, string> | Array<NavSidebarProps>>

export interface NavSidebarProps {
  pathname: string
}


const listItemStyle = css`
  line-height: 1.2;
  padding-top: 5px;
  padding-bottom: 5px;
`

const NonLeafListItem = styled(ListItem)(listItemStyle)

const LeafListItem = styled(ListItem)(({ theme }) => css`
  ${listItemStyle};
  color: ${theme.palette.text.primary};

  &:hover {
    text-decoration: none;
  }
`)

const StyledList = styled(List)`
  width: 100%;
  height: 100%;
`

const WrapperBox = styled(Box)(({ theme }) => css`
  border-inline: 1px solid ${theme.palette.divider};
  position: sticky;
  z-index: 1;
  transition: width 225ms ease-in-out, top 225ms ease-in-out;
  box-sizing: border-box;
`)

const ContainerBox = styled(Box)`
  overflow-y: auto;
  position: absolute;
  height: inherit;
  width: 100%;
  transition: transform 225ms ease-in-out;
`

const NonLeafItem: React.FC<NonLeafItemProps> = (props) => {
  const { name, padding, childItems, isOpen } = props
  const [open, setOpen] = useState(isOpen)

  return (
    <div>
      <NonLeafListItem
        onClick={() => setOpen(!open)}
        style={{ paddingLeft: `${padding}px` }}
      >
        <ListItemText
          primary={
            <Typography variant="body2" component="span">
              {name}
            </Typography>
          }
        />
        {open ? <ExpandLess fontSize="small"/> : <ExpandMore fontSize="small"/>}
      </NonLeafListItem>
      <Collapse in={open} timeout="auto" unmountOnExit={true}>
        <List disablePadding>{childItems}</List>
      </Collapse>
    </div>
  )
}

const LeafItem: React.FC<LeafItemProps> = (props) => {
  const { name, path, padding, selected } = props

  return (
    <Link key={name} to={path}>
      <LeafListItem selected={selected} sx={{ paddingLeft: `${padding}px` }}>
        <ListItemText
          primary={
            <Typography variant="body2" component="span">
              {name}
            </Typography>
          }
        />
      </LeafListItem>
    </Link>
  )
}

function listItemBuilder(node: PathListNode, padding: number, pathname: string): [React.ReactElement, boolean] {
  if (node.type === NodeType.Leaf) {
    const selected = trimTrailingSlash(node.path) === trimTrailingSlash(pathname)

    return [
      <LeafItem key={node.path} padding={padding} selected={selected} {...node}/>,
      selected,
    ]
  } else {
    const children = node.children
    let isOpen = false
    const items: NonLeafItemProps['childItems'] = []

    children.forEach((v) => {
      const [item, selected] = listItemBuilder(v, padding + 16, pathname)
      if (selected) isOpen = selected
      items.push(item)
    })

    return [
      <NonLeafItem key={node.name} isOpen={isOpen} childItems={items} padding={padding} {...node} />,
      isOpen,
    ]
  }
}

const getTabIDFromLocation = (location: string, pathList: StrIndexObj<StrIndexObj>): number => {
  const locationTrimmed = trimTrailingSlash(location)
  for (const v of Object.entries(pathList)) {
    if (Object.values(flattenObject(v[1])).map(v => trimTrailingSlash(v as string)).indexOf(locationTrimmed) > -1) return +v[0]
  }
  return -1
}

function getTypedPathList(pathList: PathListType): TypedPathList {
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

const ICON_SIZE = 40
const BTN_SIZE = ICON_SIZE + 20

const StyledIconBtn = styled(IconButton)`
  position: absolute;
  top: 0;
  width: ${BTN_SIZE}px;
  height: ${BTN_SIZE}px;

  opacity: 0.2;
  transition: opacity 225ms;

  &:hover {
    opacity: 1;
  }
`

const NavCollapseBtn = observer(() => {
  return (
    <StyledIconBtn
      aria-label="collapse nav sidebar"
      onClick={navSidebarStore.toggleCollapsed}
      sx={{ right: -BTN_SIZE }}>
      {navSidebarStore.collapsed
        ? <FormatIndentDecreaseSharp/>
        : <FormatIndentIncreaseSharp/>
      }
    </StyledIconBtn>
  )
})

const NavSidebar: React.FC<NavSidebarProps> = observer((props) => {
  const { pathname } = props
  const top = headerStore.appear ? headerStore.height : 0
  const width = navSidebarStore.collapsed ? 0 : navSidebarStore.width
  const translateX = navSidebarStore.collapsed ? -navSidebarStore.width : 0
  const tocList = React.useMemo(
    () => getTypedPathList(pathList)
      .map((item) => listItemBuilder(item, 16, pathname))
      .map(([x]) => x),
    [pathname],
  )

  return (
    <WrapperBox sx={{
      top,
      width,
      height: `calc(100vh - ${top}px)`,
      borderLeft: 'unset',
    }}>
      <ContainerBox sx={{
        transform: `translate3d(${translateX}px, 0, 0)`,
      }}>
        <StyledList>
          {tocList}
        </StyledList>
      </ContainerBox>
      <NavCollapseBtn/>
    </WrapperBox>
  )
})

export default NavSidebar
