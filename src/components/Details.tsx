import { Container, ExpansionPanel, ExpansionPanelDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

type Props = {
  className: string;
  children: string[] | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [props: string]: any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '&, &:first-child, &:last-child': {
      margin: '1.2em 0 !important',
    },
    borderLeft: '.3rem solid',
    // eslint-disable-next-line
    // @ts-ignore
    borderLeftColor: theme.palette.details.border,
  },
  expanded: {
    '&, &:first-child, &:last-child': {
      margin: '1.2em 0 !important',
    },
  },
}))

const Details: React.FC<Props> = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className = '', children, ...rest } = props
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

export default Details
