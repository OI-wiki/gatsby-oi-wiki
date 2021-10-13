import Collection from './Collection'
import { Accordion, AccordionDetails, AccordionSummary, Container, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { ExpandMore as ExpandMoreIcon, List as ListIcon } from '@material-ui/icons'
const useStyles = makeStyles({
  metaicon: {
    verticalAlign: 'sub',
  },
})
const CollectionComponent: React.FC<{ id: string }> = ({ id }) => {
  const classes = useStyles()
  return <Accordion defaultExpanded>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="problem collection"
    >
      <Typography>
        <ListIcon fontSize="small" className={classes.metaicon}></ListIcon>题单
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Container>
        <Collection id={id}></Collection>
      </Container>
    </AccordionDetails>
  </Accordion>
}

export default CollectionComponent
