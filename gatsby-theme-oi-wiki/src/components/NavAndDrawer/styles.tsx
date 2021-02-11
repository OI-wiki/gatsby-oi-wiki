import { makeStyles } from '@material-ui/core/styles'
import scrollbarStyle from '../../styles/scrollbar'

const drawerWidth = 250

interface Props{
  appBar: {
    background: string;
    color: string;
  }
}

export const useStyles = makeStyles((theme) => ({
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
  placeholder: {
    [theme.breakpoints.down('md')]: {
      minHeight: 64,
    },
    minHeight: 48 + 64,
    alignItems: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  iconItem: {
    minWidth: theme.spacing(5),
  },
}))
