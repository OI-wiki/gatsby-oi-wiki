/** @jsx jsx */
import { jsx } from "theme-ui"
import { ExpansionPanel, ExpansionPanelDetails, Container } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import blue from '@material-ui/core/colors/blue'

const useStyles = makeStyles((theme) => ({
  root: {
    "&, &:first-child, &:last-child": {
      margin: "0.8em 0 !important"
    },
    borderLeft: ".3rem solid",
    borderLeftColor: blue[500]
  },
  "expanded": {
    "&, &:first-child, &:last-child": {
      margin: "1.2em 0 !important"
    },
  }
}))

export default function({ className = "", children, ...props }) {
  
  const classes = useStyles()
  
  const cont = children instanceof Array? children : [children]
  return <ExpansionPanel variant="outlined" classes={classes} defaultExpanded={!!className.match("open")}>
    {cont[0]}
    <ExpansionPanelDetails style={{padding: "0"}}>
      <Container>
        {cont.slice(1)}
      </Container>
    </ExpansionPanelDetails>
  </ExpansionPanel>
  
}
