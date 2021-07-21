import grey from '@material-ui/core/colors/grey'
import { alpha, Theme } from '@material-ui/core/styles'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

const scrollbarStyle = (theme: Theme, otherStyles: CSSProperties, width?: number): CSSProperties => {
  const size = width || 0.4
  const scrollbarWidth = {
    '&::-webkit-scrollbar': {
      // width relative to self font-size
      width: `${size}rem`,
      height: `${size}rem`,
    },
  }

  return ({
    ...{
      '&::-webkit-scrollbar-thumb': {
        background: grey[400],
        '-webkit-border-radius': '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: alpha(theme.palette.common.black, 0.4),
      },
      scrollbarWidth: 'thin',
    },
    ...scrollbarWidth,
    ...otherStyles,
  })
}

export { scrollbarStyle }
