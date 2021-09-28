import styled from '@mui/material/styles/styled'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import React from 'react'

const StyledAccordion = styled(Accordion)(({ theme }) => css`
  margin: 1.2em 0;
  border-left: .3rem solid ${theme.palette.primary.light};
  box-shadow: ${theme.shadows[1]};

  &.Mui-expanded {
    margin: 1.2em 0;
  }
`)

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 0;
`

const Block = styled(Box)(({ theme }) => css`
  margin-inline: ${theme.spacing(2)};
`)

const Details: React.FC<React.HTMLAttributes<HTMLDetailsElement>> = (props) => {
  const { className, children } = props
  const contentArr = Array.isArray(children) ? children : [children]

  return (
    <StyledAccordion
      variant="outlined"
      className={className}
      defaultExpanded={!!className?.match('open')}
    >
      {contentArr[0]}
      <StyledAccordionDetails>
        <Block>{contentArr.slice(1)}</Block>
      </StyledAccordionDetails>
    </StyledAccordion>
  )
}

export default Details
