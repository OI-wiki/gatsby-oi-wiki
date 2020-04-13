/** @jsx jsx */
import { MdEdit, MdExpandMore } from "react-icons/md"
import { jsx } from "theme-ui"
import { ExpansionPanelSummary } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import blue from '@material-ui/core/colors/blue'

const useStyles = makeStyles((theme) => ({
  expanded: {},
  root: {
    background: blue[50],
    maxHeight: "36px",
    minHeight: "36px",
    "&$expanded": {
      minHeight: "48px",
    },
  },
  content: {
    margin: "0",
    "& p": {
      margin: "0"
    },
    fontWeight: "bold"
  },
}))

export default function({ className = null, children, ...props }) {

  const classes = useStyles()

  return <ExpansionPanelSummary
    classes={classes}
    expandIcon={<MdExpandMore/>}
    aria-controls="expand"
    {...props}
  >
    <MdEdit style={{ 
      margin: "0px 10px 2px -5px", 
      fontSize: "20px", 
      color: blue[500] }}/>
    {children}
  </ExpansionPanelSummary>
}
