const React = require('react');
const script = require('./static/script');

const darkModeSwitch = `(${script.default.toString()})()`;

const HtmlAttributes = {
	lang: 'zh-cmn-Hans',
};

const HeadComponents = [
	<meta key="charset" charSet="utf-8" />,
	<meta key="ua" httpEquiv="x-ua-compatible" content="ie=edge" />,
	<meta
		key="viewport"
		name="viewport"
		content="width=device-width, initial-scale=1, shrink-to-fit=no"
	/>,
	<script
		key="analytics"
		dangerouslySetInnerHTML={{
			__html: `window.ga_tid = "UA-124485594-1";
    window.ga_api = "https://margatroid.xyz/vue.min.js";`,
		}}
	/>,
	<script
		key="cfga"
		src="https://cdn.jsdelivr.net/npm/cfga@1.0.3"
		async
	></script>,
	<script
		key="theme"
		dangerouslySetInnerHTML={{
			__html: darkModeSwitch,
		}}
	/>,
];

exports.onPreRenderHTML = ({
	getPostBodyComponents,
	replacePostBodyComponents,
}) => {
	const comps = getPostBodyComponents();
	process.env.GATSBY_IS_DEV &&
		comps.push(
			<script
				src="https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/tex-mml-chtml.js"
				id="MathJax-script"
			/>
		);
	replacePostBodyComponents(comps);
};

exports.onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
	setHtmlAttributes(HtmlAttributes);
	setHeadComponents(HeadComponents);
};
