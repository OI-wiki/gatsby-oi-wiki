import { createMuiTheme } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import PropTypes from 'prop-types'

const theme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  console.log(prefersDarkMode)
  return createMuiTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
    },
  })
}

const globalStyles = withStyles((theme) => ({
  '@global': {
    a: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      ':hover': {
        textDecoration: 'none',
      },
      '&.active, &:active': {
        color: theme.palette.primary.light,
      },
    },
    blockquote: {
      paddingLeft: '1em',
      margin: '1em 3em 1em 2em',
      borderLeft: '4px solid rgba(0,0,0,.12)',
    },
    code: {
      padding: '0.5em 0',
      backgroundColor: 'hsla(0,0%,92.5%,.5)',
    },
    'pre code': {
      padding: '0.2em 0',
      backgroundColor: '#1E1E1E',
    },
  },
}))

function CustomCssEl () { return null }
CustomCssEl.propTypes = { classes: PropTypes.object.isRequired }

export const CustomCssBaseline = globalStyles(CustomCssEl)
export { theme }
