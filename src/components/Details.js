/** @jsx jsx */
import { Link as GatsbyLink } from "gatsby"
import { jsx } from "theme-ui"

const detailsStyle = {
  boxShadow:
    "0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2)",
  position: "relative",
  margin: "1.5625em 0",
  padding: "0 .6rem",
  borderLeft: ".25rem solid #448aff",
  borderRadius: ".1rem",
  overflow: "auto",
  fontSize: "14px",
  "&[open]": {
    summary: {
      ".expand-more-icon": {
        transform: "rotate(180deg)",
      },
    },
  },
}

export default function ({ className = "", children, ...props }) {
  return className.match("open") ? (
    <details className={className} sx={detailsStyle} {...props} open>
      {children}
    </details>
  ) : (
    <details className={className} sx={detailsStyle} {...props}>
      {children}
    </details>
  )
}
