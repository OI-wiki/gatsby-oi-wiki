import { css } from '@emotion/react'
import styled from '@mui/material/styles/styled'
import ListItem from '@mui/material/ListItem'
import React, { useState } from 'react'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import { Link } from 'gatsby'
import trimTrailingSlash from '../../lib/trailingSlash'
import { LeafItemProps, NodeType, NonLeafItemProps, PathListNode } from './types'

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

export default listItemBuilder
