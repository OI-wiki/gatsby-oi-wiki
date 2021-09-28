import 'bytemd/dist/index.css';
import './styles/override.css';
import './styles/highlight/override.css';
import './styles/code-mirror/vscode-dark.css';
import 'basic-type-extensions';
import { BytemdPlugin } from 'bytemd';
import { Editor } from '@bytemd/react';
import gemoji from '@bytemd/plugin-gemoji';
import frontmatter from '@bytemd/plugin-frontmatter';
import math from '@bytemd/plugin-math-ssr';
import highlight from '@bytemd/plugin-highlight-ssr';
import details from './plugins/details';
import pseudo from './plugins/pseudo';
import React, { useState, useEffect } from 'react';

interface MarkdownEditorProps {
	value: string;
	onChange?: (value: string) => void;
}

const MarkdownEditor: React.FC<Partial<MarkdownEditorProps>> = props => {
	let theme: 'dark' | 'light' = 'light';
	const dataTheme = document.getElementsByTagName('html').item(0)?.getAttribute('data-theme');
	if (dataTheme == 'dark') theme = 'dark';
	else if (dataTheme == 'auto' && window.matchMedia('(prefers-color-scheme: dark)')) {
		theme = 'dark';
	}
	const enabledPlugins: BytemdPlugin[] = [pseudo(), math(), details(), frontmatter(), gemoji(), highlight()];
	const [value, setValue] = useState(props.value ?? '');
	useEffect(() => {
		const containerEl = document.getElementsByClassName('bytemd').item(0)?.parentElement;
		if (containerEl != null) {
			containerEl.style.flexGrow = '1';
			containerEl.style.display = 'flex';
			containerEl.style.flexDirection = 'column';
		}
	}, []);
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
				onChange={v => {
					setValue(v);
					props.onChange?.(v);
				}}
			/>
		</>
	);
};

export default MarkdownEditor;
