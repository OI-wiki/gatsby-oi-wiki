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
    ':hover': {
      textDecoration: 'none',
    },
    '&.active': {
      color: theme.palette.text.primary,
    },
  },
}))

function linkFix (url) {
  if (/\.md/.test(url)) url = '../' + url.replace(/\.md/, '/')
  if (/#/.test(url)) return url
  if (url.split('/').slice(-1)[0] === '') return url
  return url + '/'
}

function Link ({ to = '', href = to, children, ...props }) {
  const isAbsoluteLink = isAbsoluteURL(href)
  const classes = useStyles()
  if (isAbsoluteLink) {
    return (
      <a {...props} href={href} className={classes.link} target="_black" rel="noopener noreferrer nofollow" >
        {children}
      </a>
    )
  }
  return (
    <GatsbyLink {...props} to={linkFix(href)} className={classes.link}>
      {children}
    </GatsbyLink>
  )
}

export default Link
