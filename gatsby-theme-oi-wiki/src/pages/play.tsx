import { graphql, PageProps, useStaticQuery } from 'gatsby'
import React, { useCallback, useRef, useState } from 'react'
import CodeEditor from '../components/Play/CodeEditor'
import Indicator, { IndicatorProps } from '../components/Play/Indicator'
import CodeLangMenu from '../components/Play/CodeLangMenu'
import Output from '../components/Play/Output'
import { TransformedResponseData, useRunner } from '../components/Play/useRunner'
import Layout from '../components/Layout'
import Grid from '@mui/material/Grid'
import ButtonGroup from '@mui/material/ButtonGroup'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Nullable } from '../types/common'
import Button from '@mui/material/Button'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Title from '../components/Title'
import { LangType } from '../components/Play/codeLang'

export type PlaygroundLocationState = Partial<{
  lang: LangType
  code: string
  input: string
}>

const LangMenu = styled(CodeLangMenu)`
  width: 96px;
  text-transform: none;
`

const EditorContainerGrid = styled(Grid)(({ theme }) => css`
  margin-bottom: ${theme.spacing(2)};
  //align-items: stretch;
`)

const EditorGrid = styled(Grid)`
  min-height: 400px;
`

const Progress = styled(CircularProgress)`
  position: absolute;
  left: 50%;
  right: 50%;
  margin: auto -12px;
`

const FooterContainer = styled(Box)(({ theme }) => css`
  text-align: center;
  margin-top: ${theme.spacing(4)};
`)

const FooterLink = styled(Link)`
  color: #fd9f40;

  &:hover {
    color: #fc6012;
  }

  & > img {
    display: inline;
    vertical-align: middle;
    margin-top: -4px;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`

const Footer: React.FC = () => {
  const judgeDuckImgUrl: string = useStaticQuery(graphql`
    {
      allFile(filter: { name: { eq: "judgeduck" } }) {
        edges {
          node {
            publicURL
          }
        }
      }
    }
  `).allFile.edges[0].node.publicURL

  return (
    <FooterContainer>
      <FooterLink
        href="https://duck.ac/"
        underline="none"
        target="_blank"
        variant="h6"
      >
        {'Powered by '}
        <img src={judgeDuckImgUrl} alt="JudgeDuck" height={30}/>
      </FooterLink>
    </FooterContainer>
  )
}


const Playground: React.FC<PageProps<unknown, unknown, PlaygroundLocationState>> = ({ location }) => {
  // state maybe undefined/null in gatsby build
  const locState = location.state ?? {}

  const [lang, setLang] = useState<LangType>(locState.lang ?? 'C++')
  const [o2, setO2] = useState(false)
  const [code, setCode] = useState(locState.code ?? '')
  const [input, setInput] = useState(locState.input ?? '')
  const [output, setOutput] = useState<TransformedResponseData | null>(null)
  const [runInfo, setRunInfo] = useState<IndicatorProps | null>(null)

  const outputRef = useRef<Nullable<HTMLDivElement>>(null)

  const runCodeCb = useCallback((data: TransformedResponseData) => {
    setOutput(data)
    setRunInfo(
      data.status === 'Run Finished'
        ? { type: 'success', msg: 'Success' }
        : { type: 'warning', msg: 'Checkout output for error details' },
    )

    outputRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  const errorCb = useCallback((msg: string) => {
    setRunInfo({ type: 'error', msg })
  }, [])

  const { sendRunnerReq, waiting } = useRunner(
    { stdin: input, code, language: lang, flags: o2 ? '-O2' : '' },
    runCodeCb,
    errorCb,
  )

  const handleRunClick = useCallback(() => {
    setRunInfo(null)
    sendRunnerReq()
  }, [sendRunnerReq])

  return (
    <Layout withNav={false} withToc={false} title="Playground">
      <Title noEdit={true} relativePath="">Playground</Title>

      <Grid container={true} alignItems="center">
        <Grid item={true}>
          <ButtonGroup>
            <LangMenu
              lang={lang}
              setLang={setLang}
              variant="contained"
              aria-label="select language for code running"
            />
            <Button
              variant="contained"
              color="secondary"
              endIcon={<PlayArrow/>}
              onClick={handleRunClick}
              disabled={waiting}
            >
              运行
              {waiting && <Progress color="secondary" size={24}/>}
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item={true}>
          <Fade in={!!runInfo}>
            <Indicator type="info" msg="" {...runInfo} />
          </Fade>
        </Grid>
        <Grid item={true} style={{ marginLeft: 'auto' }}>
          <FormControlLabel
            checked={o2}
            control={
              <Switch
                size="small"
                checked={o2}
                onChange={(e) => {
                  setO2(e.target.checked)
                }}
              />
            }
            label="开启O2优化"
          />
        </Grid>
      </Grid>

      <EditorContainerGrid container={true} width="auto">
        <EditorGrid item={true} xs={12} md={8}>
          <CodeEditor
            lang={lang}
            title="代码"
            value={code}
            onChange={(val) => {
              setCode(val)
            }}
          />
        </EditorGrid>
        <EditorGrid item={true} xs={12} md={4}>
          <CodeEditor
            title="输入"
            value={input}
            onChange={(val) => {
              setInput(val)
            }}
          />
        </EditorGrid>
      </EditorContainerGrid>

      <Collapse in={['success', 'warning'].includes(runInfo?.type ?? '')}>
        <Output ref={outputRef} output={output}/>
      </Collapse>

      <Footer/>

    </Layout>
  )
}

export default Playground
