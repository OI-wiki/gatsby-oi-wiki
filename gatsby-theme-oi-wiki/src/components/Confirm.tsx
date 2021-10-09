import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'
import React, { Component, ReactElement, CSSProperties } from 'react'
import { Container, render } from 'react-dom'

interface ConfirmProps {
  title: string
  message: string | ReactElement
  confirmButtonText: string
  cancelButtonText: string
  style?: CSSProperties
}
interface ConfirmState {
  isOpen: boolean
  defaultProps: ConfirmProps
  currentProps: ConfirmProps
}
const defaultProps: ConfirmProps = {
  title: '',
  message: '',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
}
export default class Confirm extends Component<Partial<ConfirmProps>, ConfirmState> {
  private resolve?: (value: boolean) => void
  public static create(props?: Partial<ConfirmProps>, container?: Container): Confirm {
    if (container == null) {
      container = document.createElement('div')
      document.body.appendChild(container)
    }
    return render<Confirm>(<Confirm {...{ ...defaultProps, ...props }} />, container) as any
  }

  public constructor(props?: Partial<ConfirmProps>) {
    const p = { ...defaultProps, ...props }
    super(p)
    this.state = {
      isOpen: false,
      defaultProps: p,
      currentProps: p,
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.show = this.show.bind(this)
  }

  private handleCancel(): void {
    this.setState({ isOpen: false })
    this.resolve!(false)
  }

  private handleConfirm(): void {
    this.setState({ isOpen: false })
    this.resolve!(true)
  }

  public show(props?: Partial<ConfirmProps>): Promise<boolean> {
    this.setState({
      isOpen: true,
      currentProps: { ...this.state.defaultProps, ...props },
    })
    return new Promise<boolean>(resolve => {
      this.resolve = resolve
    })
  }

  public render() {
    const { isOpen: open, currentProps: props } = this.state
    return (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={props.style}
      >
        {!String.isNullOrEmpty(props.title) && <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleConfirm}>{props.confirmButtonText}</Button>
          <Button onClick={this.handleCancel}>{props.cancelButtonText}</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
