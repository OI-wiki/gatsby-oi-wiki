import React, { ReactNode } from "react";
import MarkdownEditor from "../components/Editor/MarkdownEditor";
import StyledLayout from "../components/StyledLayout";

export default class EditorPage extends React.Component {
	render(): ReactNode {
		return (
			<StyledLayout
				location={location}
				noTitle={true}
				noMeta={true}
				noComment={true}
				noToc={true}
				overflow={true}
				title="Markdown编辑器"
			>
				<MarkdownEditor value="" plugins={{ details: false }} />
			</StyledLayout>
		);
	}
}