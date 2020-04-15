/**
 * This theme uses `theme-ui` under the hood.
 * @see https://theme-ui.com/
 * @see https://theme-ui.com/gatsby-plugin/
 */

import { alpha } from '@theme-ui/color'
import prism from '@theme-ui/prism/presets/theme-ui'

export default {
  breakpoints: ['768px', '992px', '1200px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  initialColorMode: 'light',
  useColorSchemeMediaQuery: true,
  colors: {
    text: '#011627',
    background: '#FFFFFF',
    primary: '#1890ff',
    secondary: '#2EC4B6',
    accent: '#FF9F1C',
    muted: '#FAFAFA',
    toc: '#484848',
    hover: '#1890FF',
  },
  fonts: {
    body:
      '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    heading: 'inherit',
    monospace: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
  },
  fontSizes: [12, 14, 16, 18, 24, 32, 40, 48, 56, 64],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  textStyles: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
  },
  linkStyles: {
    nav: {
      color: 'inherit',
      display: 'block',
      p: '0.75rem 1.5rem',
      ':hover': {
        color: 'primary',
        textDecoration: 'none',
      },
      '&.active': {
        color: 'primary',
        fontWeight: 'bold',
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
      fontSize: [1, 2],
    },
    h1: {
      variant: 'textStyles.heading',
      fontSize: [5, 6],
      pt: '3rem',
      mt: '-3rem',
    },
    h2: {
      variant: 'textStyles.heading',
      fontSize: [4, 5],
      pt: '3rem',
      mt: '-1.5rem',
    },
    h3: {
      variant: 'textStyles.heading',
      fontSize: [3, 4],
      pt: '3rem',
      mt: '-2rem',
    },
    h4: {
      variant: 'textStyles.heading',
      fontSize: [2, 3],
      pt: '3rem',
      mt: '-2.5rem',
    },
    h5: {
      variant: 'textStyles.heading',
      fontSize: [1, 2],
      pt: '3rem',
      mt: '-2.75rem',
    },
    h6: {
      variant: 'textStyles.heading',
      fontSize: [0, 1],
      pt: '3rem',
      mt: '-3rem',
    },
    p: {
      fontSize: [1, 2],
    },
    a: {
      color: 'primary',
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'none',
      },
      '&.active': {
        color: 'text',
      },
    },
    pre: {
      marginTop: '0.7rem',
      fontFamily: 'monospace',
      overflowX: 'auto',
      borderRadius: '0.5rem',
      bg: 'text',
      color: 'background',
      ...prism,
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
    table: {
      width: '100%',
      overflow: 'auto',
      borderCollapse: 'collapse',
      borderSpacing: 0,
    },
    tr: {
      borderTop: '1px solid gray',
    },
    th: {
      border: '1px solid',
      borderColor: alpha('text', 0.25),
      p: '0.25em 0.5em',
    },
    td: {
      border: '1px solid',
      borderColor: alpha('text', 0.25),
      p: '0.25em 0.5em',
    },
    blockquote: {
      pl: '.6rem',
      borderLeft: '.3rem solid rgba(0,0,0,.26)',
      color: 'rgba(0,0,0,.54)',
      margin: '1em 0',
      boxSizing: 'inherit',
    },
    img: {
      maxWidth: '100%',
    },
  },
  links: {
    color: '#fff',
  },
}
