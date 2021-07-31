import { makeStyles } from '@material-ui/core/styles'
import { scrollbarStyle } from '../../styles/scrollbar'

const drawerWidth = 250

interface Props {
  appBar: {
    background: string;
    color: string;
  }
}

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: scrollbarStyle(theme, {
    width: drawerWidth,
  }),
  hiddenDrawer: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  appBar: (props: Props) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: props.appBar.background,
    color: props.appBar.color,
  }),
  toolbar: {
    paddingLeft: '7.5px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  placeholderMargin: {
    [theme.breakpoints.down('md')]: {
      marginTop: 64,
      maxHeight: `calc(100% - ${64 + 8}px)`,
    },
    marginTop: 48 + 64,
    maxHeight: `calc(100% - ${48 + 64 + 8}px)`,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  iconItem: {
    minWidth: theme.spacing(5),
  },
}))

export { useStyles }
