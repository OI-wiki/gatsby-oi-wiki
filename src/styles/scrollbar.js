import grey from '@material-ui/core/colors/grey'
import { fade } from '@material-ui/core/styles'

export default (theme, otherStyles) => ({
  ...{
    '&::-webkit-scrollbar': {
      width: '.4rem'
    },
    '&::-webkit-scrollbar-thumb': {
      background: grey[400]
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: fade(theme.palette.primary.main, 0.44)
    }
  },
  ...otherStyles
})
