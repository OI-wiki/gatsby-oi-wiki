import React, { useState } from 'react'
import { makeStyles, Avatar, TextField, Grid, Button, Hidden } from '@material-ui/core'

interface Props {
  avatarLink: string,
  name: string
  sendComment: (res: string) => void
}

const useStyles = makeStyles(theme => ({
  contentRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: '0px',
  },
  headerRoot: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: '0px',
    paddingTop: theme.spacing(2),
  },
  commentMargin: {
    marginTop: theme.spacing(1),
  },
  button: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  buttonDiv: {
    textAlign: 'right',
    marginBottom: theme.spacing(1),
  },
}))

const CommentInput: React.FC<Props> = (props) => {
  const classes = useStyles()
  const [content, setContent] = useState('')
  return (
    <>
      <Grid container className={classes.commentMargin} justify="space-around" spacing={2}>
        <Hidden smDown>
          <Grid item>
            <Avatar alt={props.name} src={props.avatarLink}/>
          </Grid>
        </Hidden>
        <Grid item xs>
          <TextField
            placeholder="我们鼓励在讨论区讨论有意义的内容及关于文章的勘误，无意义的讨论将会被管理员删除"
            multiline
            fullWidth
            rows={5}
            value={content}
            onChange={(e) => { setContent(e.target.value) }}
            variant="outlined"
          />
        </Grid>
      </Grid>
      <div className={classes.buttonDiv}>
        <Button variant="contained" color="primary" className={classes.button} size="small">评论</Button>
      </div>
    </>
  )
}

export default CommentInput
