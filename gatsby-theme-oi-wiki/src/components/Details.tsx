import { Accordion, AccordionDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

type Props = {
  className: string;
  children: string[] | string;
  [props: string]: any;
}

const getDetailsClasses = makeStyles((theme) => ({
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

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}))

const Details: React.FC<Props> = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className = '', children, ...rest } = props
  const detailsClasses = getDetailsClasses()
  const classes = useStyles()
  const cont = children instanceof Array ? children : [children]
  return (
    <Accordion
      variant="outlined"
      classes={detailsClasses}
      defaultExpanded={!!className.match('open')}
    >
      {cont[0]}
      <AccordionDetails style={{ padding: '0' }}>
        <div className={classes.container}>{cont.slice(1)}</div>
      </AccordionDetails>
    </Accordion>
  )
}

export default Details
