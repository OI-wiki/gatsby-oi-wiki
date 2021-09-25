import { Nullable, OnClickHandler } from '../../types/common'
import React from 'react'
import styled from '@mui/material/styles/styled'
import Link from '@mui/material/Link'

export interface TocNode {
  url: string;
  title: string;
  level: number;
  status: 'active' | 'expanded' | 'collapse'
  children: TocNode[];
  parent: Nullable<TocNode>;
  element: Nullable<HTMLElement>;
  selfElement: Nullable<HTMLElement>
  index: number;
}

interface Props {
  onClick?: (item: TocNode) => OnClickHandler<HTMLSpanElement>;
  data: TocNode;
}

export interface TocListProps {
  onClick?: (item: TocNode) => OnClickHandler<HTMLSpanElement>;
  data: TocNode[]
}

interface StyledULProps extends React.HTMLAttributes<HTMLUListElement> {
  status?: TocNode['status']
}

const StyledUL = styled('ul')<StyledULProps>`
  padding-left: 0;
  list-style: none;
  overflow-y: hidden;
  transition: all 400ms ease-in-out;
  max-height: ${({ status }) => status === 'collapse' ? 0 : 600}px;
`

const StyledLI = styled('li')`
  padding: 8px 0 0;
`

const StyledLink = styled(Link)`
  display: block;
  text-underline: none;
  border-left: 4px solid transparent;
`

const TocItem: React.FC<Props> = (props) => {
  const { data, onClick, ...restProps } = props
  return (
    <StyledLink
      href={data.url}
      onClick={(e) => {
        onClick && onClick(data)(e)
      }}
      color={data.status !== 'collapse' ? 'secondary' : 'textSecondary'}
      sx={{
        paddingLeft: `${data.level + 1}em`,
        borderLeftColor: (theme) => (data.status === 'active'
          ? theme.palette.secondary.main
          : 'transparent'),
      }}
      {...restProps}
    >
      <span dangerouslySetInnerHTML={{ __html: data.title }}/>
    </StyledLink>)
}

const TocBlock: React.FC<Props> = (props) => {
  const { data, onClick, ...restProps } = props
  return (
    <StyledLI id={`toc-${data.url}`}>
      <TocItem data={data} onClick={onClick} {...restProps} />
      {data.children.length > 0 &&
      <StyledUL status={data.status}>
        {data.children.map(i => <TocBlock key={i.url} data={i} onClick={onClick}   {...restProps}/>)}
      </StyledUL>
      }
    </StyledLI>
  )
}

const TocList: React.FC<TocListProps> = (props) => {
  const { data, onClick, ...restProps } = props
  return (
    <StyledUL>
      {data.map(i => <TocBlock data={i} onClick={onClick} {...restProps} key={i.url}/>)}
    </StyledUL>
  )
}


export default TocList
