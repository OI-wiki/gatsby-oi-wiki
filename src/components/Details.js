/** @jsx jsx */
import { jsx } from "theme-ui"
import { ExpansionPanel, ExpansionPanelDetails, Container } from "@material-ui/core"
import { makeStyles } from "@material-ui/core"

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

const useStyles = makeStyles((theme) => ({
  root: {
    "&, &:first-child, &:last-child": {
      margin: "0.8em 0 !important"
    },
  },
  "expanded": {
    "&, &:first-child, &:last-child": {
      margin: "1.2em 0 !important"
    },
  }
}))

export default function({ className = "", children, ...props }) {
  
  const classes = useStyles()
  
  return <ExpansionPanel variant="outlined" classes={classes} defaultExpanded={!!className.match("open")}>
    {children[0]}
    <ExpansionPanelDetails>
      <Container>
        {children.slice(1)}
      </Container>
    </ExpansionPanelDetails>
  </ExpansionPanel>

  // return className.match("open") ? (
  //   <details className={className} sx={detailsStyle} {...props} open>
  //     {children}
  //   </details>
  // ) : (
  //   <details className={className} sx={detailsStyle} {...props}>
  //     {children}
  //   </details>
  // )
}
