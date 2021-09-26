import styled from '@mui/material/styles/styled'

const Code = styled('code')`
  &::selection {
    text-shadow: none;
    background: #b3d4fc;
  }

  @media print {
    text-shadow: none;
  }

  span.shiki-line {
    :before {
      content: counter(shiki-line-number);
      display: inline-block;
      counter-increment: shiki-line-number;
      color: #888;
      margin-right: 1em;
      margin-left: -8px;
      text-align: right;
      min-width: 2em;
      pointer-events: none;
      user-select: none;
    }
  }
`

export default Code
