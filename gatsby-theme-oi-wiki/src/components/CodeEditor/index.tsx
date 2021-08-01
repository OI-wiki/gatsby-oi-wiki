import { makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'

import type { IAceEditorProps } from 'react-ace'
import type { LangType } from '../../lib/play/codeLang'

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
const Editor = React.lazy(() => import('./Editor'))

export function CodeEditor ({
  title,
  lang,
  ...aceProps
}: CodeEditorProps): React.ReactElement {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Paper className={classes.paper}>
        {typeof window !== 'undefined' && (
          <React.Suspense fallback={<div>Editor</div>}>
            <Editor className={classes.editor} lang={lang} {...aceProps} />
          </React.Suspense>
        )}
      </Paper>
    </>
  )
}
