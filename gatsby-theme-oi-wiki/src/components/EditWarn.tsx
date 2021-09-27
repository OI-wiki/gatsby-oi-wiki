import React from 'react'
import SmartLink from './SmartLink'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import { editWarnStore } from '../stores/editWarnStore'
import { computed } from 'mobx'

const EditWarning = (): JSX.Element => {
  return (
    <>
      <Typography variant="body2">首先，感谢您能够为 OI Wiki 做出自己的贡献。</Typography>
      <Typography variant="body2">
        不过在开始之前，我们需要您了解并熟知
        <SmartLink href="/intro/htc/" target="_blank" rel="noopener noreferrer nofollow">如何参与</SmartLink>
        里的内容，以避免在编辑时产生不必要的麻烦。
      </Typography>
      <Typography variant="body2">在阅读完之后，请点击下方的按钮，然后开始编辑。</Typography>
    </>
  )
}

const EDIT_URL = 'https://github.com/OI-wiki/OI-wiki/edit/master/docs/'
const EditWarn: React.FC = observer(() => {
  const targetUrl = computed(() => EDIT_URL + editWarnStore.relativePath).get()

  const onClose = (): void => {
    editWarnStore.setOpen(false)
  }

  return (
    <Dialog
      open={editWarnStore.open}
      onClose={onClose}
    >
      <DialogTitle>编辑前须知</DialogTitle>
      <DialogContent><EditWarning/></DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button component={SmartLink} href={targetUrl} onClick={onClose}>
          开始编辑
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default EditWarn
