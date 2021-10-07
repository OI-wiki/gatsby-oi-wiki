import React from 'react'
import Ace, { IAceEditorProps } from 'react-ace'
import useThemeMode from '../../../hooks/useThemeMode'

// add language to support here
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-python'

// light/dark theme
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-tomorrow_night'
import { langModeMap, LangType } from '../codeLang'

export interface EditorProps extends Omit<IAceEditorProps, 'mode'> {
  lang?: LangType
}

const Editor: React.FC<EditorProps> = (props) => {
  const { lang, ...aceProps } = props
  const themeMode = useThemeMode()

  return (
    <Ace
      theme={themeMode === 'dark' ? 'tomorrow_night' : 'chrome'}
      mode={lang ? langModeMap[lang] : 'text'}
      width=""
      height=""
      fontSize={13}

      {...aceProps}
    />
  )
}

export default Editor
