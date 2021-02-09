import lightBlue from '@material-ui/core/colors/lightBlue'
import { makeStyles } from '@material-ui/core/styles'
import { Link as GatsbyLink } from 'gatsby'
// eslint-disable-next-line
import isAbsoluteURL from 'is-absolute-url'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  link: {
    color: lightBlue[500],
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
    '&.active': {
      color: theme.palette.text.primary,
    },
  },
}))

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
 * @param {*} link 要修复的相对路径
 * @param {*} isIndex 当前页面是不是 index（index.md）
 */
function linkFix (link, isIndex) {
  link = link.replace(/\.(md|markdown|mdtext|mdx)/g,'/')
  if(isIndex === false) link = '../' + link
  if (/[^/]$/.test(link) && !/#/.test(link)) {
    link += '/' // append '/' for links, but excluding urls includes `#`.
  }
  return link 
}

function RealLink ({ to = '', href = to, children, pathname, isIndex, ...props }) {
  const classes = useStyles()
  if (props?.className?.search('anchor') > -1) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    )
  }
  if (isAbsoluteURL(href)) {
    return (
      <a {...props} href={href} className={classes.link} target="_blank" rel="noopener noreferrer nofollow" >
        {children}
      </a>
    )
  }
  return (
    <GatsbyLink {...props} to={linkFix(href, isIndex)} className={classes.link}>
      {children}
    </GatsbyLink>
  )
}

function LinkGetter (location, isIndex = false) {
  return function Link (props) {
    return <RealLink {...props} pathname={location.pathname} isIndex={isIndex} />
  }
}

export default LinkGetter 
