import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core'
import { PlayArrow } from '@material-ui/icons'
import type { PageProps } from 'gatsby'
import React, { useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import Layout from '../components/Layout'
import { langList, LangType } from '../lib/codeLang'

const useStyles = makeStyles({
  langSelect: {
    width: '80px',
  },
  editor: {
    minHeight: '250px',
  },
})

export default function Playground ({
  location,
}: PageProps): React.ReactElement {
  const classes = useStyles()
  const [lang, setLang] = useState<LangType>('C++')

  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  return (
    <Layout location={location} title="Playground">
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FormControl color="secondary">
            <InputLabel id="lang-select-label">语言</InputLabel>
            <Select
              labelId="lang-select-label"
              id="lang-select"
              className={classes.langSelect}
              value={lang}
              onChange={(e) => {
                setLang(e.target.value as LangType)
              }}
            >
              {langList.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayArrow />}
          >
            运行
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} alignItems="stretch">
        <Grid xs={12} md={8} className={classes.editor} item>
          <CodeEditor
            lang={lang}
            title="代码"
            value={code}
            onChange={(val) => {
              setCode(val)
            }}
          />
        </Grid>
        <Grid xs={12} md={4} item container direction="column">
          <Grid className={classes.editor} item>
            <CodeEditor
              title="输入"
              value={input}
              onChange={(val) => {
                setInput(val)
              }}
            />
          </Grid>
          <Grid className={classes.editor} item>
            <CodeEditor
              title="输出"
              value={output}
              onChange={(val) => {
                setOutput(val)
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}
