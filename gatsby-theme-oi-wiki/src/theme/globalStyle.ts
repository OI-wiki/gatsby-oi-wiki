import { css, SerializedStyles } from '@emotion/react'
import { Theme } from '@mui/material/styles/createTheme'

// the css here will be injected by the <GlobalStyles>
// position: src/gatsby-func/WrapRootElement.tsx
const globalStyle = (theme: Theme): SerializedStyles => css`
  :root {
    --code-block-font: "Fira Mono", "Menlo", "Monaco", "Consolas", "Andale Mono", "Ubuntu Mono", "Courier New", "Hack", "Fira Code", "Jetbrains Mono", monospace;

    &[data-monofont=fallback] {
      --code-block-font: monospace;
    }
  }

  codeblock.gatsby-highlight {
    background-color: var(--shiki-color-background);
    padding: 2px 16px;
    margin: 8px 0;
    border-radius: 4px;
    box-shadow: 0 2px 4px ${theme.palette.divider};
    font-family: var(--code-block-font);
  }
`

export default globalStyle
