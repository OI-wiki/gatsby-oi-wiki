import { CleanOption } from 'basic-type-extensions';
import { SnackbarOrigin, Snackbar } from '@material-ui/core';
import Alert, { Color as Severity } from '@material-ui/lab/Alert';
import React, { Component, CSSProperties, ReactElement } from 'react';
import { Container, render } from 'react-dom';

interface MessageProps {
	severity: Severity;
	message: string | ReactElement;
	position: SnackbarOrigin;
	duration: number | null;
	style?: CSSProperties;
	wrapperStyle?: CSSProperties;
}
interface MessageState {
	isOpen: boolean;
	defaultProps: MessageProps;
	currentProps: MessageProps;
}
const defaultProps: MessageProps = {
	severity: 'info',
	message: '',
	position: {
		horizontal: 'center',
		vertical: 'top',
	},
	duration: 3000,
};
export default class Message extends Component<Partial<MessageProps>, MessageState> {
	private resolve?: () => void;
	public static create(props?: Partial<MessageProps>, container?: Container): Message {
		if (container == null) {
			container = document.createElement('div');
			document.body.appendChild(container);
		}
		return render<Message>(<Message {...{ ...defaultProps, ...props }} />, container) as any;
	}

	public constructor(props?: Partial<MessageProps>) {
		const p = { ...defaultProps, ...props };
		super(p);
		this.state = {
			isOpen: false,
			defaultProps: p,
			currentProps: p,
		};
		this.handleClose = this.handleClose.bind(this);
		this.show = this.show.bind(this);
		this.success = this.success.bind(this);
		this.info = this.info.bind(this);
		this.warning = this.warning.bind(this);
		this.error = this.error.bind(this);
	}

	private handleClose(): void {
		this.setState({ isOpen: false });
		this.resolve!();
	}

	public show(props?: Partial<MessageProps>): Promise<void> {
		if (props) Object.clean(props, CleanOption.Undefined);
		this.setState({
			isOpen: true,
			currentProps: { ...this.state.defaultProps, ...props },
		});
		return new Promise<void>(resolve => {
			this.resolve = resolve;
		});
	}

	public success(message: string | ReactElement, duration?: number | null, position?: SnackbarOrigin) {
		return this.show({
			severity: 'success',
			message,
			position,
			duration,
		});
	}

	public info(message: string | ReactElement, duration?: number | null, position?: SnackbarOrigin) {
		return this.show({
			severity: 'info',
			message,
			position,
			duration,
		});
	}

	public warning(message: string | ReactElement, duration?: number | null, position?: SnackbarOrigin) {
		return this.show({
			severity: 'warning',
			message,
			position,
			duration,
		});
	}

	public error(message: string | ReactElement, duration?: number | null, position?: SnackbarOrigin) {
		return this.show({
			severity: 'error',
			message,
			position,
			duration,
		});
	}

	public render() {
		const { isOpen: open, currentProps: props } = this.state;
		return (
			<Snackbar
				open={open}
				autoHideDuration={props.duration}
				onClose={this.handleClose}
				style={props.wrapperStyle}
			>
				<Alert onClose={this.handleClose} severity={props.severity} style={props.style}>
					{props.message}
				</Alert>
			</Snackbar>
		);
	}
}

export const messageService = Message.create();
