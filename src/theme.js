import { createMuiTheme } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const theme = createMuiTheme({
  palette: {
  },
})

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
