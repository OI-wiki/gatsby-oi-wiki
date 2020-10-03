import grey from '@material-ui/core/colors/grey'
import { fade } from '@material-ui/core/styles'

export default (theme, otherStyles, width) => {
  let scrollbarWidth
  if (width) {
    scrollbarWidth = {
      '&::-webkit-scrollbar': {
        // width relative to self font-size
        width: `${width}rem`,
        height: `${width}rem`,
      },
    }
  } else {
    scrollbarWidth = {
      '&::-webkit-scrollbar': {
        width: '.4rem',
        height: '.4rem',
      },
    }
  }
  return ({
    ...{
      '&::-webkit-scrollbar-thumb': {
        background: grey[400],
        '-webkit-border-radius': '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: fade(theme.palette.common.black, 0.4),
      },
      scrollbarWidth: 'thin',
    },
    ...scrollbarWidth,
    ...otherStyles,
  })
}
