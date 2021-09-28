import React from 'react'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AccordionSummary from '@mui/material/AccordionSummary'
import Edit from '@mui/icons-material/Edit'
import styled from '@mui/material/styles/styled'
import { blue } from '@mui/material/colors'
import { css } from '@emotion/react'

const summaryStyle = css`
  min-height: 36px;
  height: auto;
`

const StyledAccordionSummary = styled(AccordionSummary)`
  ${summaryStyle};

  &.Mui-expanded {
    ${summaryStyle};
  }

  .MuiAccordionSummary-content {
    margin-block: 8px;

    &.Mui-expanded {
      margin-block: 8px;
    }

    p {
      margin-block: 8px;
    }
  }

  .MuiAccordionSummary-expandIconWrapper {
    padding: 2px;

    &.Mui-expanded {
      padding: 2px;
    }
  }
`

const StyledEditIcon = styled(Edit)`
  margin: 0 10px 2px -5px;
  align-self: center;
  color: ${blue[500]};
`

const Summary: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { children, ...others } = props

  return (
    <StyledAccordionSummary
      expandIcon={<ExpandMore/>}
      aria-controls="expand"
      {...others}
    >
      <StyledEditIcon/>
      {children}
    </StyledAccordionSummary>
  )

}

export default Summary
