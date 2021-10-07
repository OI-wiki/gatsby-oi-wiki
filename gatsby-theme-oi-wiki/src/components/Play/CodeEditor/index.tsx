import React from 'react'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { NoSsr } from '@mui/material'
import { EditorProps } from './Editor'

export interface CodeEditorProps extends EditorProps {
  title: string
}

const StyledPaper = styled(Paper)`
  height: calc(100% - 32px);
`

const editorStyle = {
  height: '100%',
}

const Editor = React.lazy(() => import('./Editor'))

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const { title, lang, ...aceProps } = props

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <StyledPaper>
        <NoSsr>
          <React.Suspense fallback={<div>Loading editor...</div>}>
            <Editor style={editorStyle} lang={lang} {...aceProps} />
          </React.Suspense>
        </NoSsr>
      </StyledPaper>
    </>
  )
}

export default CodeEditor
