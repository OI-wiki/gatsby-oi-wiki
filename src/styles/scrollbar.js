import grey from '@material-ui/core/colors/grey'
import { fade } from '@material-ui/core/styles'

export default (theme, otherStyles) => ({
  ...{
    '&::-webkit-scrollbar': {
      // width relative to self font-size
      width: '.4em',
      height: '.4em',
    },
    '&::-webkit-scrollbar-thumb': {
      background: grey[400],
      '-webkit-border-radius': '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: fade(theme.palette.common.black, 0.4),
    },
    scrollbarWidth: 'thin',
  },
  ...otherStyles,
})
