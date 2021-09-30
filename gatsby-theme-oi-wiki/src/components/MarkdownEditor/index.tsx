import 'bytemd/dist/index.css';
import './styles/override.css';
import './styles/highlight/override.css';
import './styles/code-mirror/vscode-dark.css';
import 'basic-type-extensions';
import { BytemdPlugin } from 'bytemd';
import cn from 'bytemd/lib/locales/zh_Hans.json';
import { Editor } from '@bytemd/react';
import gemoji from '@bytemd/plugin-gemoji';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math-ssr';
import highlight from '@bytemd/plugin-highlight-ssr';
import details from './plugins/details';
import pseudo from './plugins/pseudo';
import React, { useState, useEffect, ReactElement } from 'react';
import { render } from 'react-dom';

interface MarkdownEditorProps {
	theme: 'light' | 'dark';
	value: string;
	onChange?: (value: string) => void;
}

const MarkdownEditor: React.FC<Partial<MarkdownEditorProps>> = props => {
	const theme = props.theme ?? 'light';
	const enabledPlugins: BytemdPlugin[] = [pseudo(), math(), details(), frontmatter(), gemoji(), highlight()];
	const [value, setValue] = useState(props.value ?? '');
	useEffect(() => {
		const containerEl = document.getElementsByClassName('bytemd')[0]?.parentElement!;
		containerEl.style.flexGrow = '1';
		containerEl.style.display = 'flex';
		containerEl.style.flexDirection = 'column';
	}, []);
	useEffect(() => {
		let toolbarEl: HTMLDivElement | null = null;
		for (const div of document.getElementsByClassName('bytemd-toolbar-right'))
			if (div.hasAttribute('custom-toolbar')) {
				toolbarEl = div as HTMLDivElement;
				break;
			}
		if (toolbarEl == null) {
			toolbarEl = document.createElement('div');
			toolbarEl.className = 'bytemd-toolbar-right';
			toolbarEl.setAttribute('custom-toolbar', '');
		}
		for (const item of toolbarEl.children) {
			if (item.hasAttribute('custom-toolbar-item')) toolbarEl.removeChild(item);
		}
		const items: ReactElement[] = [];
		function addItems(el: any) {
			if (!React.isValidElement(el)) return;
			const element = el as ReactElement;
			if (element.props.children != null && Object.keys(element.props).length == 1) {
				for (const item of element.props.children) addItems(item);
			}
			items.push(element);
		}
		if (!Object.isNullOrEmpty(props.children)) {
			addItems(props.children);
			const elements = items.map(item => (
				<div className="bytemd-toolbar-icon bytemd-tippy bytemd-tippy-right" style={{ width: 24, height: 24 }}>
					{item}
				</div>
			));
			render(elements, toolbarEl);
		}
	}, [props.children]);
	useEffect(() => setValue(props.value ?? ''), [props.value]);
	return (
		<>
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
				integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
				crossOrigin="anonymous"
			/>
			<link
				rel="stylesheet"
				href={
					'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/' +
					(theme == 'dark' ? 'vs2015' : 'vs') +
					'.min.css'
				}
			/>
			<Editor
				value={value}
				plugins={enabledPlugins}
				editorConfig={{
					theme: theme,
					smartIndent: true,
				}}
				previewDebounce={500}
				locale={cn}
				onChange={v => {
					setValue(v);
					props.onChange?.(v);
				}}
			/>
		</>
	);
};

export default MarkdownEditor;
