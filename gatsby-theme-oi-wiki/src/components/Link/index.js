import { makeStyles } from '@material-ui/core/styles'
import { Link as GatsbyLink } from 'gatsby'
// eslint-disable-next-line
import isAbsoluteURL from 'is-absolute-url'
import React from 'react'
import LinkTooltip from './LinkTooltip'
import path from 'path'
import clsx from 'clsx'

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
 *
 * @param {string} link 要修复的相对路径
 * @param {boolean} isIndex 当前页面是不是 index（index.md）
 * @returns {string}
 */
function linkFix (link, isIndex) {
  if (/^\//.test(link)) return link // absolute path
  link = link.replace(/\.(md|markdown|mdtext|mdx)/g, '/').replace('index', '')
  if (isIndex === false) link = '../' + link
  if (/[^/]$/.test(link) && !/#/.test(link)) {
    link += '/' // append '/' for links, but excluding urls includes `#`.
  }
  return link
}

function getAPIURL (link, pathname, isIndex) {
  if (/[^/]$/.test(pathname)) pathname += '/'
  link = link.replace(/\.(md|markdown|mdtext|mdx)/g, '/').replace(/#(.*?)$/, '')
  if (/^[^/]/.test(link)) {
    if (isIndex === false) link = '../' + link
    link = path.resolve(pathname, link)
  }
  return `https://api.mgt.moe/preview?path=${link}`
}
function isRef (link) {
  return /^#/.test(link)
}

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.secondary.light,
    },
    transition: `color ${250}ms ease-in-out`,
  },
}))

/**
 * 智能链接
 *
 * - 如果是目录则使用原生 a 标签
 * - 如果是 URL 就设为外链
 * - 如果是 markdown 引用（纯哈希）则使用引用
 * - 如果是 path 则根据 tooltip 属性决定是否启用 Tooltip
 *
 * @param {object} props.to 指向的链接
 * @param {object} props.href to 的别名
 * @param {object} props.tooltip 是否对站内链接启用 Tooltip 预览，如果为 true 则必须给出 pathname
 * @param {object} props.isIndex 用于 markdown 内链的修复, 设置为 true 可以避免相关影响
 * @param {object} props.pathname 当前页面的 path，用于获取 Tooltip API URL
 * @return {JSX.Element}
 */
function SmartLink ({
  to = '',
  href = to,
  className,
  children,
  tooltip = false,
  pathname = null,
  isIndex = true,
  ...props
}) {
  const classes = useStyles()
  if (props?.className?.search('anchor') > -1) {
    return <a {...props} href={href}>{children}</a>
  }

  // in case Link is constructed wrongly
  if (typeof href !== 'string') {
    href = ''
  }

  if (isAbsoluteURL(href)) {
    return (
      <a {...props} href={href} className={clsx(className, classes.link)} target="_blank" rel="noopener noreferrer nofollow" >
        {children}
      </a>
    )
  }
  if (isRef(href)) {
    return (
      <GatsbyLink {...props} to={href} className={clsx(className, classes.link)}>
        {children}
      </GatsbyLink>
    )
  }
  if (tooltip) {
    return (
      <LinkTooltip url={getAPIURL(href, pathname, isIndex)} to={linkFix(href, isIndex)}>
        <GatsbyLink {...props} to={linkFix(href, isIndex)} className={clsx(className, classes.link)}>
          {children}
        </GatsbyLink>
      </LinkTooltip>
    )
  } else {
    return (
      <GatsbyLink {...props} to={linkFix(href, isIndex)} className={clsx(className, classes.link)}>
        {children}
      </GatsbyLink>
    )
  }
}

export {
  SmartLink,
}
