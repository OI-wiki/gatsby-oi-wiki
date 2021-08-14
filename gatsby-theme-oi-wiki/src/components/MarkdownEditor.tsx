import "bytemd/dist/index.css";
import "../styles/vscode-dark.css";
import "../styles/markdown-editor.css";
import { Editor } from "@bytemd/react";
import breaks from "@bytemd/plugin-breaks";
import footnotes from "@bytemd/plugin-footnotes";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import { BytemdPlugin } from "bytemd";
import $ from "jquery";
import React, { useState, useEffect } from "react";

interface MarkdownPlugin {
	breaks: boolean;
	footnotes: boolean;
	frontmatter: boolean;
	gemoji: boolean;
	gfm: boolean;
	highlight: boolean;
	math: boolean;
	mediumZoom: boolean;
	mermaid: boolean;
}

interface MarkdownEditorProps {
	value: string;
	plugins?: MarkdownPlugin;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
	plugins = {
		breaks: true,
		footnotes: true,
		frontmatter: true,
		gemoji: true,
		gfm: true,
		highlight: true,
		math: true,
		mediumZoom: true,
		mermaid: true,
	},
	...props
}) => {
	const enabledPlugins: BytemdPlugin[] = [];
	if (plugins.breaks) enabledPlugins.push(breaks());
	if (plugins.footnotes) enabledPlugins.push(footnotes());
	if (plugins.frontmatter) enabledPlugins.push(frontmatter());
	if (plugins.gemoji) enabledPlugins.push(gemoji());
	if (plugins.gfm) enabledPlugins.push(gfm());
	if (plugins.highlight) enabledPlugins.push(highlight());
	if (plugins.math) enabledPlugins.push(math());
	if (plugins.mediumZoom) enabledPlugins.push(mediumZoom());
	if (plugins.mermaid) enabledPlugins.push(mermaid());
	const [value, setValue] = useState(props.value);
	useEffect(() => {
		const codeMirrors = $(".CodeMirror");
		let theme: "dark" | "light" = "light";
		const dataTheme = $("html").attr("data-theme");
		if (dataTheme == "dark") theme = "dark";
		else if (
			dataTheme == "auto" &&
			window.matchMedia("(prefers-color-scheme: dark)")
		) {
			theme = "dark";
		}
		for (let i = 0; i < codeMirrors.length; ++i) {
			const codeMirror = codeMirrors.eq(i);
			const classes = codeMirror
				.attr("class")
				?.split(/\s+/)
				?.filter((c) => c.startsWith("cm-s-"));
			if (classes) {
				for (const className of classes)
					codeMirror.removeClass(className);
			}
			codeMirror.addClass(
				theme == "dark" ? "cm-s-vscode-dark" : "cm-s-default"
			);
		}
		$(".bytemd").unwrap();
	});
	return (
		<Editor
			value={value}
			plugins={enabledPlugins}
			onChange={(v) => setValue(v)}
		/>
	);
};

export default MarkdownEditor;
