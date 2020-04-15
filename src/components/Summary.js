import { ExpansionPanelSummary } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  expanded: {}, // DONT DELETE THIS
  root: {
    background: blue[50],
    minHeight: '36px',
    '&$expanded': {
      minHeight: '36px',
      height: 'auto'
    },
    height: 'auto'
  },
  expandIcon: {
    padding: '2px',
    '&$expanded': {
      padding: '2px'
    }
  },
  content: {
    margin: '4px',
    '& p': {
      margin: '4px'
    },
    '&$expanded': {
      margin: '4px'
    },
    fontWeight: 'bold'
  }
}))

export default function Summary ({ className = null, children, ...props }) {
  const classes = useStyles()

  return (
    <ExpansionPanelSummary
      classes={classes}
      expandIcon={<ExpandMoreIcon />}
      aria-controls="expand"
      {...props}
    >
      <EditIcon
        style={{
          margin: '0px 10px 2px -5px',
          alignSelf: 'center',
          color: blue[500]
        }}
      />
      {children}
    </ExpansionPanelSummary>
  )
}
