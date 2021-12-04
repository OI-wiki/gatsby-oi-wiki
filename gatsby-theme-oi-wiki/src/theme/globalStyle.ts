import { css, SerializedStyles } from '@emotion/react'
import { Theme } from '@mui/material/styles/createTheme'
import pseudoCodeStyle from './pseudoCodeStyle'

// the css here will be injected by the <GlobalStyles>
// position: src/gatsby/WrapRootElement.tsx
const globalStyle = (theme: Theme): SerializedStyles => css`
  :root {
    --code-block-font: "Fira Mono", "Menlo", "Monaco", "Consolas", "Andale Mono", "Ubuntu Mono", "Courier New", "Hack", "Fira Code", "Jetbrains Mono", monospace;

    &[data-monofont=fallback] {
      --code-block-font: monospace;
    }
  }

  ${pseudoCodeStyle(theme)};
`

export default globalStyle
