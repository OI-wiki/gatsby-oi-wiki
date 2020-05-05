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
    spacing: 4,
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
  },
}))

function CustomCssEl () { return null }
CustomCssEl.propTypes = { classes: PropTypes.object.isRequired }

export const CustomCssBaseline = globalStyles(CustomCssEl)
export { theme }
