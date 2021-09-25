import { css } from '@emotion/react'
import { grey } from '@mui/material/colors'

const scrollbarStyle = css`
  --scrollbar-size: 0.4rem;

  scrollbar-width: thin;

  &::-webkit-scrollbar {
    // width relative to self font-size
    width: var(--scrollbar-size);
    height: var(--scrollbar-size);
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${grey[400]};
    border-radius: 4px;

    &:hover {
      background-color: ${grey[600]};
    }
  }
`

export default scrollbarStyle
