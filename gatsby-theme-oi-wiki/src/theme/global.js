import { withStyles } from '@material-ui/core/styles'

const globalStyles = withStyles((theme) => ({
  '@global': {
    a: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
    },
    blockquote: {
      margin: 0,
      padding: '1px 0 1px 1.2em',
      // paddingLeft: '1em',
      // margin: '1em 3em 1em 2em',
      borderLeft: `4px solid ${theme.palette.blockquote}`,
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
    },
    ol: {
      paddingInlineStart: 30,
    },
    ul: {
      paddingInlineStart: 30,
    },
  },
}))

export default globalStyles
