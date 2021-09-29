import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import React, { Component } from 'react';
import { render } from 'react-dom';

interface ConfirmProps {
	title: string;
	message: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
}
interface ConfirmState {
	isOpen: boolean;
	defaultProps: ConfirmProps;
	currentProps: ConfirmProps;
}
class Confirm extends Component<ConfirmProps, ConfirmState> {
	private resolve?: (value: boolean) => void;
	public static create(props?: ConfirmProps): Confirm {
		props ??= {
			title: '',
			message: '',
		};
		return render<Confirm>(<Confirm {...props} />, document.body) as any;
	}

	public constructor(props?: ConfirmProps) {
		props ??= {
			title: '',
			message: '',
		};
		super(props);
		this.state = {
			isOpen: false,
			defaultProps: props,
			currentProps: props,
		};
		this.handleCancel = this.handleCancel.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
		this.show = this.show.bind(this);
	}

	private handleCancel(): void {
		this.setState({ isOpen: false });
		this.resolve!(false);
	}

	private handleConfirm(): void {
		this.setState({ isOpen: false });
		this.resolve!(true);
	}

	public show(props?: ConfirmProps): Promise<boolean> {
		props ??= this.state.defaultProps;
		this.setState({
			isOpen: true,
			currentProps: props,
		});
		return new Promise<boolean>(resolve => {
			this.resolve = resolve;
		});
	}

	public render() {
		const { isOpen: open, currentProps: props } = this.state;
		return (
			<Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">{props.message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleConfirm}>{props.confirmButtonText ?? '确定'}</Button>
					<Button onClick={this.handleCancel}>{props.cancelButtonText ?? '取消'}</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default Confirm;
export const confirmService = Confirm.create();
