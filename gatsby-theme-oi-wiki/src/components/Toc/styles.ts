import { makeStyles } from '@material-ui/core/styles'
import { scrollbarStyle } from '../../styles/scrollbar'

export const useStyles = makeStyles((theme) => ({
  main: scrollbarStyle(theme, {
    right: 0,
    width: '17%',
    flexShrink: 0,
    position: 'fixed',
    height: 'calc(100vh - 250px)',
    overflowY: 'auto',
    padding: theme.spacing(2, 2, 2, 0),
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
      top: theme.spacing(7),
      marginTop: theme.spacing(7),
    },
    [theme.breakpoints.only('md')]: {
      display: 'block',
      top: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
  }, 0.33),
  contents: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(1.5),
  },
}))
