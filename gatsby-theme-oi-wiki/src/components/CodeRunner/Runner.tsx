import React from 'react'
import Ace from 'react-ace'
import useDarkMode from '../../lib/useDarkMode'
import { langModeMap } from './codeLang'

// add language to support here
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-python'

// light/dark theme
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

import { CodeEditorProps } from '.'

const Runner: React.FC<Omit<CodeEditorProps, 'title'>> = ({ lang, ...aceProps }) => {
  const isDarkMode = useDarkMode()

  return (
    <Ace
      theme={isDarkMode ? 'tomorrow_night' : 'chrome'}
      width=""
      height=""
      fontSize={13}
      mode={lang ? langModeMap[lang] : 'text'}
      {...aceProps}
    />
  )
}

export default Runner
