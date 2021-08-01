import {
  Button,
  ButtonGroup,
  CircularProgress,
  Collapse,
  Fade,
  Grid,
  makeStyles,
} from '@material-ui/core'
import { PlayArrow } from '@material-ui/icons'
import type { PageProps } from 'gatsby'
import React, { useCallback, useRef, useState } from 'react'
import { CodeEditor } from '../components/CodeEditor'
import type { IndicatorProps } from '../components/Indicator'
import { Indicator } from '../components/Indicator'
import { LangMenu } from '../components/LangMenu'
import Layout from '../components/Layout'
import { Output } from '../components/Output'
import { RunSettings, RunSettingsMenu } from '../components/RunSettingsMenu'
import type { LangType } from '../lib/play/codeLang'
import type { TransformedResponseData } from '../lib/play/useRunner'
import { useRunner } from '../lib/play/useRunner'
// import smoothScrollTo from '../lib/smoothScroll'

const useStyles = makeStyles((theme) => ({
  langMenu: {
    width: 96,
    textTransform: 'none',
  },
  editor: {
    minHeight: 400,
  },
  editorContainer: {
    marginBottom: theme.spacing(2),
  },
  progress: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
}))

// mock runner api
// FIXME: Cause error during webpack dev or just switch to normal import
// if (process.env.NODE_ENV === 'development') {
//   Promise.all([import('msw'), import('../lib/play/mockRunnerHandler')]).then(
//     ([{ setupWorker }, { handlers }]) => {
//       const worker = setupWorker(...handlers)
//       worker.start({ onUnhandledRequest: 'bypass' })
//     },
//   )
// }

export default function Playground ({
  location,
}: PageProps): React.ReactElement {
  const classes = useStyles()

  const [lang, setLang] = useState<LangType>('C++')
  const [settings, setSettings] = useState<RunSettings>({ o2: false })

  const [code, setCode] = useState('')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<TransformedResponseData | null>(null)
  const [showOutput, setShowOutput] = useState(false)

  const [runInfo, setRunInfo] = useState<IndicatorProps | null>(null)

  const outputRef = useRef<HTMLElement>(null)

  const runCodeCb = useCallback((data: TransformedResponseData) => {
    setOutput(data)
    setShowOutput(true)
    setRunInfo({ type: 'success', msg: 'Success' })
  }, [])
  const errorCb = useCallback((msg: string) => {
    setRunInfo({ type: 'error', msg })
  }, [])
  const { sendRunnerReq, waiting } = useRunner(
    { stdin: input, code, language: lang, flags: settings.o2 ? '-O2' : '' },
    runCodeCb,
    errorCb,
  )

  const handleRunClick = useCallback(() => {
    setRunInfo(null)
    setShowOutput(false)
    sendRunnerReq()
  }, [sendRunnerReq])

  return (
    <Layout location={location} title="Playground">
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <ButtonGroup>
            <LangMenu
              lang={lang}
              setLang={setLang}
              variant="contained"
              className={classes.langMenu}
              aria-label="select language for code running"
            />
            <Button
              variant="contained"
              color="secondary"
              endIcon={<PlayArrow />}
              onClick={handleRunClick}
              disabled={waiting}
            >
              运行
              {waiting && (
                <CircularProgress
                  className={classes.progress}
                  color="secondary"
                  size={24}
                />
              )}
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Fade in={!!runInfo}>
            <Indicator type={undefined} msg="" {...runInfo} />
          </Fade>
        </Grid>
        <Grid item>
          <RunSettingsMenu settings={settings} setSettings={setSettings} />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        className={classes.editorContainer}
        alignItems="stretch"
      >
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
        </Grid>
      </Grid>
      <Collapse in={showOutput}>
        <Output ref={outputRef} output={output} />
      </Collapse>
    </Layout>
  )
}
