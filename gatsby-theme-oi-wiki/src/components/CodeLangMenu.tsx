import type { ButtonProps } from '@material-ui/core';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownOutlined from '@material-ui/icons/ArrowDropDownOutlined';
import React, { useCallback, useState } from 'react';
import type { LangType } from './CodeRunner/codeLang';
import { langList } from './CodeRunner/codeLang';

interface CodeLangMenuProps extends ButtonProps {
	lang: LangType;
	setLang: React.Dispatch<React.SetStateAction<LangType>>;
}

const CodeLangMenu: React.FC<CodeLangMenuProps> = ({
	lang,
	setLang,
	...buttonProps
}) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleButtonClick = useCallback(
		(e: React.MouseEvent<HTMLElement>) => {
			setAnchorEl(e.currentTarget);
		},
		[]
	);

	const handleItemClick = useCallback(
		(_: React.MouseEvent<HTMLLIElement>, index: number) => {
			setLang(langList[index] as LangType);
			setAnchorEl(null);
		},
		[setLang]
	);

	return (
		<>
			<Button
				onClick={handleButtonClick}
				endIcon={<ArrowDropDownOutlined />}
				{...buttonProps}
			>
				{lang}
			</Button>
			<Menu
				open={!!anchorEl}
				anchorEl={anchorEl}
				onClose={() => {
					setAnchorEl(null);
				}}
			>
				{langList.map((l, index) => (
					<MenuItem
						key={l}
						value={l}
						onClick={(e) => handleItemClick(e, index)}
					>
						{l}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default CodeLangMenu;
