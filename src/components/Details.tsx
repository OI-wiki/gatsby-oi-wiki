import { Container, Accordion, AccordionDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

type Props = {
  className: string;
  children: string[] | string;
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
    <Accordion
      variant="outlined"
      classes={classes}
      defaultExpanded={!!className.match('open')}
    >
      {cont[0]}
      <AccordionDetails style={{ padding: '0' }}>
        <Container>{cont.slice(1)}</Container>
      </AccordionDetails>
    </Accordion>
  )
}

export default Details
