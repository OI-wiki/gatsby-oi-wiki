// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, CircularProgress, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles, TextField, Theme } from '@material-ui/core'
import React, { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CollectionClient } from './CollectionClient'

const useStyles = makeStyles((theme: Theme) => createStyles({
  input: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  dialogContent: {
    // width: '400px',
  },
}))

const DetailInputDialog: React.FC<{ open: boolean; onClose: () => void; finishCallback: () => void; client: CollectionClient; pageId: string }> = ({
  finishCallback,
  onClose,
  open,
  client,
  pageId,
}) => {
  const styles = useStyles()
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [nameErrorText, setNameErrorText] = useState('')
  const confirm = async (): Promise<void> => {
    setLoading(true)
    const resp = await client.sendProposal(pageId, name, url, description)
    if (!resp.ok) {
      setNameErrorText(resp.message)
      setLoading(false)
      return
    }
    onClose()
    finishCallback()
  }
  return <div>
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') onClose()
      }}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>添加提案</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <TextField
          fullWidth
          error={nameErrorText !== ''}
          disabled={loading}
          className={styles.input}
          label='题目名'
          value={name}
          onChange={e => {
            setName(e.target.value)
            setNameErrorText('')
          }}
          helperText={nameErrorText !== '' ? nameErrorText : '题目名用以同其他提案相区分，请保证唯一性'}
        ></TextField>
        <TextField
          fullWidth
          disabled={loading}
          className={styles.input}
          label='题目链接'
          value={url}
          onChange={e => setUrl(e.target.value)}
        ></TextField>
        <TextField
          fullWidth
          rows={5}
          disabled={loading}
          className={styles.input}
          variant='outlined'
          label='题目详情'
          value={description}
          multiline
          onChange={e => setDescription(e.target.value)}
        ></TextField>

        {loading && <Grid container justifyContent='center'>
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>}
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose} color='primary'>取消</Button>
        <Button disabled={loading} onClick={confirm} color='primary'>确定</Button>
      </DialogActions>
    </Dialog>
  </div>
}

export default DetailInputDialog
