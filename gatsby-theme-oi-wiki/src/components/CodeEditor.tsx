// FIXME: Not compatible with Gatsby SSR build

import { makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import Ace from 'react-ace'
import type { IAceEditorProps } from 'react-ace'
import { langModeMap, LangType } from '../lib/play/codeLang'
import useDarkMode from '../lib/useDarkMode'

// add language to support here
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'

// light/dark theme
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

interface CodeEditorProps extends Omit<IAceEditorProps, 'mode'> {
  title: string
  lang?: LangType
}

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 'calc(100% - 32px)',
  },
  editor: {
    height: '100%',
  },
}))

export default function CodeEditor ({
  title,
  lang,
  ...aceProps
}: CodeEditorProps): React.ReactElement {
  const classes = useStyles()
  const isDarkMode = useDarkMode()

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Paper className={classes.paper}>
        <Ace
          className={classes.editor}
          theme={isDarkMode ? 'tomorrow_night' : 'chrome'}
          width=""
          height=""
          fontSize={13}
          mode={lang ? langModeMap[lang] : 'text'}
          {...aceProps}
        />
      </Paper>
    </>
  )
}
