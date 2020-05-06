import {
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
} from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme) => ({
  root: {
    '&, &:first-child, &:last-child': {
      margin: '1.2em 0 !important',
    },
    borderLeft: '.3rem solid',
    borderLeftColor: blue[500],
  },
  expanded: {
    '&, &:first-child, &:last-child': {
      margin: '1.2em 0 !important',
    },
  },
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Details ({ className = '', children, ...props }) {
  const classes = useStyles()

  const cont = children instanceof Array ? children : [children]
  return (
    <ExpansionPanel
      variant="outlined"
      classes={classes}
      defaultExpanded={!!className.match('open')}
    >
      {cont[0]}
      <ExpansionPanelDetails style={{ padding: '0' }}>
        <Container>{cont.slice(1)}</Container>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
