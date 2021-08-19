import "bytemd/dist/index.css";
import "./styles/override.css";
import "./styles/highlight/override.css";
import "./styles/code-mirror/vscode-dark.css";
import "basic-type-extensions";
import { BytemdPlugin } from "bytemd";
import { Editor } from "@bytemd/react";
import breaks from "@bytemd/plugin-breaks";
import footnotes from "@bytemd/plugin-footnotes";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import math from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import highlight from "@bytemd/plugin-highlight-ssr";
import details from "./plugins/details";
import pseudo from "./plugins/pseudo";
import $ from "jquery";
import React, { useState, useEffect } from "react";

interface MarkdownPlugin {
	math: boolean;
	details: boolean;
	breaks: boolean;
	footnotes: boolean;
	frontmatter: boolean;
	gemoji: boolean;
	gfm: boolean;
	highlight: boolean;
	mediumZoom: boolean;
	mermaid: boolean;
}

interface MarkdownEditorProps {
	value: string;
	plugins?: Partial<MarkdownPlugin>;
}

const MarkdownEditor: React.FC<Partial<MarkdownEditorProps>> = (props) => {
	const plugins: MarkdownPlugin = {
		math: true,
		highlight: true,
		details: true,
		breaks: false,
		footnotes: false,
		frontmatter: true,
		gemoji: true,
		gfm: false,
		mediumZoom: false,
		mermaid: false,
		...props.plugins,
	};
	let theme: "dark" | "light" = "light";
	const dataTheme = $("html").attr("data-theme");
	if (dataTheme == "dark") theme = "dark";
	else if (
		dataTheme == "auto" &&
		window.matchMedia("(prefers-color-scheme: dark)")
	) {
		theme = "dark";
	}
	const enabledPlugins: BytemdPlugin[] = [];
	enabledPlugins.push(pseudo());
	if (plugins.math) enabledPlugins.push(math());
	if (plugins.details) enabledPlugins.push(details());
	if (plugins.breaks) enabledPlugins.push(breaks());
	if (plugins.footnotes) enabledPlugins.push(footnotes());
	if (plugins.frontmatter) enabledPlugins.push(frontmatter());
	if (plugins.gemoji) enabledPlugins.push(gemoji());
	if (plugins.gfm) enabledPlugins.push(gfm());
	if (plugins.highlight) enabledPlugins.push(highlight());
	if (plugins.mediumZoom) enabledPlugins.push(mediumZoom());
	if (plugins.mermaid) enabledPlugins.push(mermaid());
	const [value, setValue] = useState(props.value ?? "");
	useEffect(() => {
		$(".bytemd")
			.parent()
			.css("flex-grow", 1)
			.css("display", "flex")
			.css("flex-direction", "column");
	});
	return (
		<>
			{plugins.math && (
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
					integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
					crossOrigin="anonymous"
				/>
			)}
			{plugins.highlight && (
				<link
					rel="stylesheet"
					href={
						"https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/styles/" +
						(theme == "dark" ? "vs2015" : "vs") +
						".min.css"
					}
				/>
			)}
			<Editor
				value={value}
				plugins={enabledPlugins}
				editorConfig={{
					theme: theme,
					smartIndent: true,
				}}
				previewDebounce={500}
				onChange={(v) => setValue(v)}
			/>
		</>
	);
};

export default MarkdownEditor;
