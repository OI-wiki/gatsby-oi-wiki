import { createMuiTheme } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
// import useMediaQuery from '@material-ui/core/useMediaQuery'
import PropTypes from 'prop-types'

// const theme = () => {
//   const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
//   return createMuiTheme({
//     palette: {
//       type: prefersDarkMode ? 'dark' : 'light',
//     },
//   })
// }

const theme = createMuiTheme({})

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
      padding: '2px 4px',
      'border-radius': '2px',
      'font-size': '90%',
      color: '#37474f',
      backgroundColor: 'hsla(0,0%,85%,.5)',
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
export { theme }
