import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Link from './Link'

const editWarning = (
  <DialogContentText>
    <p>首先，感谢您能够为 OI Wiki 做出自己的贡献。</p>
    <p>
      不过在开始之前，我们需要您了解并熟知
      <Link to={'/intro/htc/'}>如何参与</Link>
      里的内容，以避免在编辑时产生不必要的麻烦。
    </p>
    <p>在阅读完之后，请点击下方的按钮，然后开始编辑。</p>
  </DialogContentText>
)
function EditWarn ({ relativePath, dialogOpen, setDialogOpen }) {
  const editURL = 'https://github.com/OI-wiki/OI-wiki/edit/master/docs/'
  return (
    <Dialog
      open={dialogOpen}
      onClose={() => {
        setDialogOpen(false)
      }}
    >
      <DialogTitle>{'编辑前须知'}</DialogTitle>
      <DialogContent>{editWarning}</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false)
          }}
        >
          取消
        </Button>
        <Button
          component="a"
          href={editURL + relativePath}
          target="_blank"
          rel="noopener nofollow"
          onClick={() => {
            setDialogOpen(false)
          }}
        >
          开始编辑
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditWarn
