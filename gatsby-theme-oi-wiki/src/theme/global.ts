import { withStyles } from '@material-ui/core/styles'

const globalStyles = withStyles((theme) => ({
  '@global': {
    a: {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.secondary.light,
        textDecoration: 'none',
      },
      transition: `color ${250}ms ease-in-out`,
    },
    blockquote: {
      margin: 0,
      padding: '1px 0 1px 1.2em',
      // paddingLeft: '1em',
      // margin: '1em 3em 1em 2em',
      borderLeft: `4px solid ${(theme.palette as any).blockquote}`,
    },
    '.gatsby-highlight': {
      backgroundColor: '#FFF',
      padding: '2px 16px',
      margin: '8px 0',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(var(--divider))',
      filter: 'var(--highlight-filter)',
    },
    '.gatsby-highlight code': {
      fontFamily: 'var(--code-block-font)',
    },
    html: {
      '--code-block-font': '"Fira Mono", "Menlo", "Monaco", "Consolas", "Andale Mono", "Ubuntu Mono", "Courier New", "Hack", "Fira Code", "Jetbrains Mono", monospace',
    },
    'html[data-monofont=fallback]': {
      '--code-block-font': 'monospace',
    },
    img: {
      maxWidth: '100%',
      filter: 'var(--image-filter)',
    },
    ol: {
      paddingInlineStart: 30,
    },
    ul: {
      paddingInlineStart: 30,
    },
    '.inline-code': {
      color: 'rgba(var(--inline-code-color))',
      backgroundColor: 'rgba(var(--inline-code-background))',
      margin: '0 .09412em',
      padding: '0.2em 0.3em 0.04353em',
      borderRadius: '.1rem',
      wordBreak: 'break-word',
      '-webkit-box-decoration-break': 'clone',
      'box-decoration-break': 'clone',
      fontSize: '90%',
      fontFamily: 'var(--code-block-font)',
    },
  },
}))

export default globalStyles
