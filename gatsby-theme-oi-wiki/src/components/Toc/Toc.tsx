import { Link as MuiLink } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

interface Node {
  url: string;
  title: string;
  level: number;
  active: boolean;
  element?: any;
  children?: Array<Node>;
  parent: Node|null;
}

interface Props {
  onClick?: (item: Node) => (event: any) => void;
  data: Node;
}
interface TocProps {
  onClick?: (item: Node) => (event: any) => void;
  data: Array<Node>
}

const useStyles = makeStyles((theme) => ({
  ul: {
    paddingLeft: 0,
    listStyle: 'none',
    overflowY: 'hidden',
    transition: `all ${400}ms ease-in-out`,
    maxHeight: 600,
  },
  notActiveUl: {
    maxHeight: 0,
  },
  li: {
    padding: '8px 0 0 0',
  },
  link: {
    borderLeft: `4px solid transparent`,
  },
  active: {
    borderLeft: `4px solid ${theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[800] }`,
  },
}))

function TocItem(props: Props): JSX.Element {
  const { data, onClick, ...restProps } = props
  const classes = useStyles()
  return (
    <MuiLink
      {...restProps}
      display="block"
      color={data.active ? 'textPrimary' : 'textSecondary'}
      href={data.url}
      underline="none"
      onClick={(e) => {
        onClick && onClick(data)(e)
      }}
      style={{
        paddingLeft: `${data.level+1}em`,
      }}
      className={clsx(classes.link, data.active && classes.active )}
    >
      <span dangerouslySetInnerHTML={{ __html: data.title }} />
    </MuiLink>
  )
}

function TocComponent(props: Props): JSX.Element {
  const { data, onClick, ...restProps } = props
  const classes = useStyles()
  return (
    <li className={clsx(classes.li)}>
      <TocItem data={data} onClick={onClick} {...restProps} />
      {data.children && (<ul className={clsx(classes.ul, !data.active && classes.notActiveUl )}>{
        data.children.map(i => <TocComponent data={i} onClick={onClick} {...restProps} key={i.url} />)
      }</ul>)}
    </li>
  )
}

function Toc(props: TocProps): JSX.Element {
  const { data, onClick, ...restProps } = props
  const classes = useStyles()
  return (
    <ul className={classes.ul}>{
      data.map(i => <TocComponent data={i} onClick={onClick} {...restProps} key={i.url} />)
    }</ul>
  )
}

export default Toc
export {
  Node
}