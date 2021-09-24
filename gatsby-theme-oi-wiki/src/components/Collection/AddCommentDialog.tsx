// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, CircularProgress, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionClient } from './CollectionClient'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionUser } from './types'

const useStyles = makeStyles(() => createStyles({
  textBox: {
    // width: theme.spacing(),
  },
  dialog: {
    // width: theme.spacing(30),
  },
}))

interface AddCommentDialogProps {
  issueId: number;
  user: CollectionUser;
  client: CollectionClient;
  finishCallback: () => void;
  onClose: () => void;
  open: boolean;
}

const AddCommentDialog: React.FC<AddCommentDialogProps> = (props) => {
  const styles = useStyles()
  const {
    client,
    issueId,
    finishCallback,
    onClose,
    open,
  } = props
  const [errorText, setErrorText] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const sendComment = async (): Promise<void> => {
    if (text === '') {
      setErrorText('请输入评论内容')
      return
    }
    setLoading(true)
    await client.sendComment(issueId, text)
    setLoading(false)
    onClose()
    finishCallback()
  }
  return <>
    <Dialog
      maxWidth='sm'
      fullWidth
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') onClose()
      }}
    >
      <DialogTitle>发表评论</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            className={styles.textBox}
            error={errorText !== ''}
            helperText={errorText}
            disabled={loading}
            variant='outlined'
            label='评论内容'
            value={text}
            multiline
            rows={5}
            fullWidth
            onChange={e => {
              setText(e.target.value)
              setErrorText('')
            }}
          ></TextField>
        </div>
        {loading && <Grid container justifyContent='center'>
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>}
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose} color='primary'>
          关闭
        </Button>
        <Button disabled={loading} onClick={sendComment} color='secondary'>
          提交
        </Button>
      </DialogActions>
    </Dialog>
  </>
}

export default AddCommentDialog
