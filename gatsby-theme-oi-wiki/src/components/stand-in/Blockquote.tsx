import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'

const Blockquote = styled('blockquote')(({ theme }) => css`
  margin: 1rem 0;
  padding: 0 1.5rem;
  color: ${theme.palette.text.primary};
  border-left: .25rem solid ${theme.palette.grey['300']};
`)

export default Blockquote
