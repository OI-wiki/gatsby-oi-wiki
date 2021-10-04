import { makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'

import type { IAceEditorProps } from 'react-ace'
import type { LangType } from './codeLang'

export interface CodeEditorProps extends Omit<IAceEditorProps, 'mode'> {
  title: string
  lang?: LangType
}

const useStyles = makeStyles({
  paper: {
    height: 'calc(100% - 32px)',
  },
  editor: {
    height: '100%',
  },
})

// fix ssr issue related to react-ace
const Editor = React.lazy(() => import('./Runner'))

const CodeEditor: React.FC<CodeEditorProps> = ({ title, lang, ...aceProps }) => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Paper className={classes.paper}>
        {typeof window !== 'undefined' && (
          <React.Suspense fallback={<div>Loading editor...</div>}>
            <Editor className={classes.editor} lang={lang} {...aceProps} />
          </React.Suspense>
        )}
      </Paper>
    </>
  )
}

export default CodeEditor
