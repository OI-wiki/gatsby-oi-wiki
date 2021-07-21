import { alpha, makeStyles } from '@material-ui/core/styles'
import { scrollbarStyle } from '../../styles/scrollbar'

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  searchResultPrimary: {
    '& em': {
      fontStyle: 'normal',
      color: theme.palette.secondary.main,
      background: 'rgba(143,187,237,.1)',
    },
  },
  searchResultSecondary: {
    '& em': {
      fontStyle: 'normal',
      padding: '0 0 2px',
      boxShadow: `inset 0 -2px 0 0 ${theme.palette.secondary.main}`,
      // 使用 box shadow 模拟下划线
    },
  },
  inputRoot: {
    color: 'inherit',
    display: 'block',
    // margin: theme.spacing(1, 1, 1, 0),
    marginLeft: `calc(1em + ${theme.spacing(4)}px)`,
    marginTop: '2px',
    marginBottom: '2px',
  },
  smallScreenInputRoot: {
    color: 'inherit',
    display: 'block',
    // margin: theme.spacing(1, 1, 1, 0),
    marginLeft: `calc(1em + ${theme.spacing(4)}px)`,
    marginTop: '9px',
    marginBottom: '6px',
  },
  inputInput: {
    // vertical padding + font size from searchIcon
    // width: '100%',
    [theme.breakpoints.up('md')]: {
      transition: theme.transitions.create('width'),
      width: '15vw',
      '&:focus': {
        width: '30vw',
      },
    },
    [`&::-webkit-search-decoration,
       &::-webkit-search-cancel-button,
       &::-webkit-search-results-button,
       &::-webkit-search-results-decoration`]: {
      display: 'none',
    },
  },
  wideInput: {
    [theme.breakpoints.up('md')]: {
      transition: theme.transitions.create('width'),
      width: '30vw',
    },
  },
  resultPaper: scrollbarStyle(theme, {
    marginTop: '12px',
    minWidth: `calc(30vw + 1em + ${theme.spacing(4)}px)`,
    maxWidth: '50vw',
    position: 'absolute',
    right: '0 !important',
    top: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: theme.zIndex.drawer + 2,
  }),
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    maxWidth: `calc(30vw + 1em + ${theme.spacing(4)}px)`,
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    zIndex: theme.zIndex.drawer + 2,
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchColorBlack: {
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
  },
  searchColorWhite: {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchMessage: {
    padding: '8px 8px 8px 20px',
    backgroundColor: theme.palette.search.messageBackground,
  },
  smallScreenSearchIcon: {
    padding: theme.spacing(1.5),
    height: '100%',
    // position: 'absolute',
    // pointerEvents: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallScreenReturnIcon: {
    padding: theme.spacing(1.5),
    // padding: 0,
    // height: '100%',
    position: 'absolute',
    display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',

  },
  dialogHeader: {
    display: 'block',
    alignItems: 'center',
    '-webkit-border-radius': '0',
    '-moz-border-radius': '0',
    'border-radius': '0',
  },
}))
