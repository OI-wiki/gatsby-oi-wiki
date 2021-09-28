import styled from '@mui/material/styles/styled'
import { grey } from '@mui/material/colors'
import React from 'react'

const StyledCode = styled('code')`
  color: ${grey[800]};
  background-color: ${grey[100]};
  word-break: break-word;
  font-family: var(--code-block-font);
  font-size: .9rem;

  border-radius: .2rem;
  padding: 0.2rem 0.4rem 0;
  margin: 0 0.2rem;
  box-decoration-break: clone;
`

const Code: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  const { children, className, ...others } = props
  return typeof className === 'undefined'
    ? <StyledCode {...others}>{children}</StyledCode>
    : <code className={className} {...others}>{children}</code>
}

export default Code
