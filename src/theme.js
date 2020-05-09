import { createMuiTheme } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

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
      paddingLeft: '1em',
      margin: '1em 3em 1em 2em',
      borderLeft: `4px solid ${theme.palette.blockquote}`,
    },
    code: {
      padding: '2px 4px',
      'border-radius': '2px',
      'font-size': '90%',
      color: theme.palette.inlineCode.color,
      backgroundColor: theme.palette.inlineCode.background,
    },
    'pre code': {
      'font-size': '100%',
      padding: '0.2em 0',
      backgroundColor: '#1E1E1E',
    },
  },
}))

function CustomCssEl () {
  return null
}

CustomCssEl.propTypes = { classes: PropTypes.object.isRequired }

export const CustomCssBaseline = globalStyles(CustomCssEl)

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    footer: {
      background: grey[200],
      text: grey[700],
    },
    details: {
      border: blue[500],
      main: blue[50],
    },
    blockquote: 'rgba(0,0,0,.12)',
    inlineCode: {
      color: '#37474f',
      background: 'hsla(0,0%,85%,.5)',
    },
    search: {
      messageBackground: grey[100],
    },
    tab: {
      colorOnHover: '#000',
    },
  },
})

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    footer: {
      background: grey[900],
      text: grey[300],
    },
    details: {
      border: blue[500],
      main: grey[700],
    },
    blockquote: 'rgba(255,255,255,.12)',
    inlineCode: {
      color: grey[100],
      background: 'hsla(0,0%,85%,.5)',
    },
    search: {
      messageBackground: grey[700],
    },
    tab: {
      colorOnHover: '#fff',
    },
  },
})

export { lightTheme, darkTheme }
