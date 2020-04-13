/** @jsx jsx */
import { MdEdit, MdExpandMore } from "react-icons/md"
import { jsx } from "theme-ui"
import { ExpansionPanelSummary } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles"
import blue from '@material-ui/core/colors/blue'

const useStyles = makeStyles((theme) => ({
  expanded: {}, // DONT DELETE THIS
  root: {
    background: blue[50],
    minHeight: "36px",
    "&$expanded": {
      minHeight: "36px",
      height: "auto",
    },
    height: "auto",
  },
  expandIcon: {
    padding: "2px",
    "&$expanded": {
      padding: "2px",
    }
  },
  content: {
    margin: "0",
    "& p": {
      margin: "0"
    },
    "&$expanded": {
      margin: "0",
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
