/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccordionSummary } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  expanded: {}, // DONT DELETE THIS
  root: {
    background: (theme.palette as unknown as any).details.main,
    minHeight: '36px',
    '&$expanded': {
      minHeight: '36px',
      height: 'auto',
    },
    height: 'auto',
  },
  expandIcon: {
    padding: '2px',
    '&$expanded': {
      padding: '2px',
    },
  },
  content: {
    margin: '4px',
    '& p': {
      margin: '4px',
    },
    '&$expanded': {
      margin: '4px',
    },
    fontWeight: 'bold',
  },
}))
interface Props{
  className: string;
  children: string;
  [props: string]: any;
}

const Summary: React.FC<Props> = (props) => {
  const { className = null, children, ...rest } = props
  const classes = useStyles()

  return (
    <AccordionSummary
      classes={classes}
      expandIcon={<ExpandMoreIcon />}
      aria-controls="expand"
      {...props}
    >
      <EditIcon
        style={{
          margin: '0px 10px 2px -5px',
          alignSelf: 'center',
          color: blue[500],
        }}
      />
      {children}
    </AccordionSummary>
  )
}

export default Summary
