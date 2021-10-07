import React, { useCallback, useState } from 'react'
import Menu from '@mui/material/Menu'
import { Nullable } from '../../types/common'
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined'
import Button, { ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { langList, LangType } from './codeLang'

interface CodeLangMenuProps extends ButtonProps {
  lang: LangType
  setLang: React.Dispatch<React.SetStateAction<LangType>>
}

const CodeLangMenu: React.FC<CodeLangMenuProps> = (props) => {
  const { lang, setLang, ...buttonProps } = props
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }, [])

  const handleItemClick = useCallback(
    (_: React.MouseEvent<HTMLLIElement>, index: number) => {
      setLang(langList[index] as LangType)
      setAnchorEl(null)
    },
    [setLang],
  )

  return (
    <>
      <Button
        onClick={handleButtonClick}
        endIcon={<ArrowDropDownOutlined/>}
        {...buttonProps}
      >
        {lang}
      </Button>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null)
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
  )
}

export default CodeLangMenu
