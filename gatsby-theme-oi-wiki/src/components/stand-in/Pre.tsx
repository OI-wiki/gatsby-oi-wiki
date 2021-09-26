import styled from '@mui/material/styles/styled'
import scrollbarStyle from '../../theme/scrollbarStyle'

const Pre = styled('pre')`
  ${scrollbarStyle};

  counter-reset: shiki-line-number;

  overflow: auto;
  font-size: 13px;
  text-shadow: none;
  direction: ltr;
  text-align: left;
  white-space: pre-wrap;
  word-spacing: normal;
  word-break: normal;
  tab-size: 2;
  hyphens: none;

  &::selection {
    text-shadow: none;
    background: #b3d4fc;
  }


  @media print {
    text-shadow: none;
  }
`

export default Pre
