import { css, SerializedStyles } from '@emotion/react'
import { Theme } from '@mui/material/styles/createTheme'

// the css here will be injected by the <GlobalStyles>
// position: src/gatsby-func/WrapRootElement.tsx
const globalStyle = (_theme: Theme): SerializedStyles => css`
  :root {
    --code-block-font: "Fira Mono", "Menlo", "Monaco", "Consolas", "Andale Mono", "Ubuntu Mono", "Courier New", "Hack", "Fira Code", "Jetbrains Mono", monospace;

    &[data-monofont=fallback] {
      --code-block-font: monospace;
    }
  }
`

export default globalStyle
