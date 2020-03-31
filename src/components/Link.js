/** @jsx jsx */
import { Link as GatsbyLink } from "gatsby"
import isAbsoluteURL from "is-absolute-url"
import { jsx } from "theme-ui"
import theme from "../theme"

const linkStyles = theme.styles.a

function linkFix(url) {
  if (/\.md/.test(url)) url = "../" + url.replace(/\.md/, "/")
  if (/\#/.test(url)) return url
  if (url.split("/").slice(-1) == "") return url
  return url + "/"
}

function Link({ to = "", href = to, children, ...props }) {
  const isAbsoluteLink = isAbsoluteURL(href)
  if (isAbsoluteLink)
    return (
      <a {...props} href={href} sx={linkStyles}>
        {children}
      </a>
    )
  return (
    <GatsbyLink {...props} to={linkFix(href)} sx={linkStyles}>
      {children}
    </GatsbyLink>
  )
}

export default Link
