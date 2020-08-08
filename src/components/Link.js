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

function linkFix (url, currentPath) {
  if (currentPath.split('/').slice(-1)[0] !== '') {
    currentPath += '/'
  }
  if (/^\.\./.test(url)) {
    url = currentPath + '../' + url
    // ../xxx/yyy -> fullpathname/../xxx/yyy
    // prepend full pathname for relative path
  }
  if (/^\./.test(url)) {
    if (/[a-zA-Z0-9]+\/[a-zA-Z0-9]+/.test(url)) {
      url = currentPath + url.slice(2)
      // ./xxx/yyy -> fullpathname/../xxx/yyy
    } else {
      url = currentPath + '.' + url
      // ./xx -> fullpathname/(remove current part)xx
    }
    // prepend full pathname for relative path
  }
  if (url.split('/').slice(-1)[0] !== '' && !/#/.test(url)) {
    url += '/' // append '/' for links, but excluding urls includes `#`.
  }
  return url
}

function RealLink ({ to = '', href = to, children, pathname, ...props }) {
  const isAbsoluteLink = isAbsoluteURL(href)
  const classes = useStyles()
  if (props?.className?.search('anchor') > -1) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    )
  }
  if (isAbsoluteLink) {
    return (
      <a {...props} href={href} className={classes.link} target="_blank" rel="noopener noreferrer nofollow" >
        {children}
      </a>
    )
  }
  return (
    <GatsbyLink {...props} to={linkFix(href, pathname)} className={classes.link}>
      {children}
    </GatsbyLink>
  )
}

function GetLink (location) {
  return function Link (props) {
    return <RealLink {...props} pathname={location.pathname} />
  }
}

export default GetLink
