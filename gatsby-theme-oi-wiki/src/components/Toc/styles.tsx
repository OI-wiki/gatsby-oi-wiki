import { makeStyles } from '@material-ui/core/styles'
import scrollbarStyle from '../../styles/scrollbar'

export const useStyles = makeStyles((theme) => ({
  main: scrollbarStyle(theme, {
    right: 0,
    width: '15%',
    flexShrink: 0,
    position: 'fixed',
    height: 'calc(100vh - 284px)',
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
  ul: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  item: {
    fontSize: 13,
    padding: theme.spacing(0.5, 0, 0.5, 1),
    borderLeft: '4px solid transparent',
    boxSizing: 'content-box',
    scrollBehavior: 'smooth',
    '&:hover': {
      borderLeft: `4px solid ${
        theme.palette.type === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[900]
      }`,
    },
    '&$active,&:active': {
      borderLeft: `4px solid ${
        theme.palette.type === 'light'
          ? theme.palette.grey[400]
          : theme.palette.grey[800]
      }`,
    },
  },
  secondaryItem: {
    paddingLeft: theme.spacing(2.5),
  },
  active: {},
}))