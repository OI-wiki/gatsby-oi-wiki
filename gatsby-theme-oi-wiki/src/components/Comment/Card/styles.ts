import { makeStyles } from '@material-ui/core'
import Red from '@material-ui/core/colors/red'

export const useStyles = makeStyles(theme => ({
  contentRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: '0px',
    paddingTop: '0px',
  },
  headerRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: '0px',
    paddingTop: theme.spacing(2),
  },
  commentMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  red: {
    color: Red[500],
  },
  yellow: {
    color: '#ffcf56',
  },
  nullReactionStartIcon: {
    marginLeft: '0px',
    marginRight: '0px',
  },
  nullReaction: {
    padding: '5px 10px',
  },
  reactionButton: {
    minWidth: '0px',
  },
  labelMargin: {
    marginLeft: '1.5px',
  },
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: theme.spacing(1.5),
  },
  floatRight: {
    float: 'right',
  },
}))
