import React from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import StyledLayout from '../components/StyledLayout';

const EditorPage: React.FC = (_) => {
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
			<MarkdownEditor value="" />
		</StyledLayout>
	);
};

export default EditorPage;
