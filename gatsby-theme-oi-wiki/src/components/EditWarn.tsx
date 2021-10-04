import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'

import React from 'react'
import { SmartLink } from './Link'

const EditWarning = (): JSX.Element => {
  return (
    <>
      <p>首先，感谢您能够为 OI Wiki 做出自己的贡献。</p>
      <p>
        不过在开始之前，我们需要您了解并熟知
        <SmartLink to="/intro/htc/" target="_blank" rel="noopener noreferrer nofollow">
          如何参与
        </SmartLink>
        里的内容，以避免在编辑时产生不必要的麻烦。
      </p>
      <p>在阅读完之后，请点击下方的按钮，然后开始编辑。</p>
    </>
  )
}

export interface EditWarnProps {
  relativePath: string
  dialogOpen: boolean
  setDialogOpen: (props: boolean) => any
  location: Location
}

const EditWarn: React.FC<EditWarnProps> = props => {
  const { relativePath, dialogOpen, setDialogOpen } = props
  const editURL = '/editor'
  const onClose = (): void => {
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onClose={onClose}>
      <DialogTitle>编辑前须知</DialogTitle>
      <DialogContent>
        <EditWarning />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          component="a"
          href={`${editURL}?path=${relativePath}`}
          rel="noopener noreferrer nofollow"
          onClick={onClose}
        >
          开始编辑
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditWarn
