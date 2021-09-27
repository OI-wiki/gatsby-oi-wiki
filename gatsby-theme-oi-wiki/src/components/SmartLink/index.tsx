import { Link as GatsbyLink } from 'gatsby'
import isAbsoluteURL from 'is-absolute-url'
import React from 'react'
import LinkTooltip from './LinkTooltip'
import path from 'path'
import smoothScrollTo from '../../lib/smoothScroll'
import { OnClickHandler } from '../../types/common'
import { css, SerializedStyles } from '@emotion/react'
import styled from '@mui/material/styles/styled'
import Link, { LinkProps } from '@mui/material/Link'
import { getElementViewPosition } from './utils'
import { observer } from 'mobx-react-lite'
import { headerStore } from '../../stores/headerStore'
import { computed } from 'mobx'
import { Theme } from '@mui/material/styles/createTheme'

const MD_EXPR = /\.(md|markdown|mdtext|mdx)/g

/**
 * 修复相对路径的页面链接
 *
 * Example 1:
 * - link: `../a/b/c`, path: `/x/y/`, isIndex: `false`
 * - return: `/x/y/../../a/b/c` (`/a/b/c/`)
 *
 * Example 2:
 * - link: `../a/b/c`, path: `/x/y/`, isIndex: `true`
 * - return: `/x/y/../a/b/c` (`/x/a/b/c/`)
 *
 * 实际上不需要当前页面的 path
 */
const linkFix = (link: string, isIndex: boolean): string => {
  if (link.startsWith('/')) return link // absolute path

  let newLink = link.replace(MD_EXPR, '/').replace('index', '')
  if (!isIndex) newLink = '../' + newLink
  // append '/' for links, but excluding urls includes `#`.
  if (newLink.endsWith('/') && !newLink.includes('#')) {
    newLink += '/'
  }
  return newLink
}

const getAPILink = (link: string, pathname: string, isIndex: boolean): string => {
  let newLink = link.replace(MD_EXPR, '/').replace(/#(.*?)$/, '')
  if (!newLink.startsWith('/')) {
    if (!isIndex) newLink = '../' + newLink
    if (pathname.endsWith('/')) pathname += '/'
    newLink = path.resolve(pathname, newLink)
  }
  return `https://api.mgt.moe/preview?path=${newLink}`
}

const isRef = (link: string): boolean => link.startsWith('#')

const linkStyle = ({ theme }: { theme?: Theme }): SerializedStyles => css`
  color: ${theme?.palette.secondary.main};
  text-decoration: none;
  transition: color 225ms ease-in-out;

  &:hover {
    color: ${theme?.palette.secondary.main};
  }
`

const StyledLink = styled(Link)(linkStyle)

const StyledGLink = styled(GatsbyLink)(linkStyle)

export interface SmartLinkProps extends LinkProps {
  /** 类名 */
  className?: string;
  /** 是否对站内链接启用 Tooltip 预览，如果为 true 则必须给出 pathname */
  tooltip?: boolean;
  /** 当前页面的 path，用于获取 Tooltip API URL */
  pathname?: string;
  /** 用于 markdown 内链的修复, 设置为 true 可以避免相关影响 */
  isIndex?: boolean;
  /** state data only exist on GatsbyLink */
  state?: Record<string, any>
}

const SCROLL_PADDING = 24

const RefLink: React.FC<SmartLinkProps> = observer((props) => {
  const { href = '', children, ...others } = props
  const headerHeight = computed((): number => headerStore.appear ? headerHeight : 0).get()

  const onClick: OnClickHandler = (e) => {
    e.preventDefault()

    const target = document.getElementById(href.substring(1, href.length))
    const yDis = getElementViewPosition(target).y + window?.pageYOffset - headerHeight - SCROLL_PADDING

    smoothScrollTo(yDis)
  }

  return (
    <StyledGLink to={href} onClick={onClick} {...others as any}>
      {children}
    </StyledGLink>
  )
})

/**
 * 智能链接
 *
 * - 如果是目录则使用原生 a 标签
 * - 如果是 URL 就设为外链
 * - 如果是 markdown 引用（纯哈希）则使用引用
 * - 如果是 path 则根据 tooltip 属性决定是否启用 Tooltip
 */
const SmartLink: React.FC<SmartLinkProps> = (props) => {
  const { tooltip = false, href = '', isIndex = true, pathname, children, ...others } = props

  if (others?.className?.includes('anchor')) {
    delete others.className
    return <Link {...others} href={href}>{children}</Link>
  } else if (isAbsoluteURL(href)) {
    return (
      <StyledLink href={href} target="_blank" rel="noopener noreferrer nofollow">
        {children}
      </StyledLink>
    )
  } else if (isRef(href)) {
    return <RefLink href={href} {...others}>{children}</RefLink>
  } else if (tooltip) {
    if (!pathname) throw new Error('tooltip 为 true 时必须给出 pathname')
    return (
      <LinkTooltip url={getAPILink(href, pathname, isIndex)} to={linkFix(href, isIndex)}>
        <StyledGLink to={linkFix(href, isIndex)} {...others as any}>
          {children}
        </StyledGLink>
      </LinkTooltip>
    )
  } else {
    return (
      <GatsbyLink to={linkFix(href, isIndex)} {...others as any}>
        {children}
      </GatsbyLink>
    )
  }
}

export default SmartLink
