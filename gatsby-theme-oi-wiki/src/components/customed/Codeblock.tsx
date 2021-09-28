import { LangType } from '../../lib/play/codeLang'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import styled from '@mui/material/styles/styled'
import { css } from '@emotion/react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import SvgIcon from '@mui/material/SvgIcon'
import Stack from '@mui/material/Stack'
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined'
import CodeOutlined from '@mui/icons-material/CodeOutlined'
import { navigate } from 'gatsby'
import has from 'lodash/has'

interface ToolBtnProps extends IconButtonProps {
  title: string;
  Icon: typeof SvgIcon;
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  'data-language': string;
}


const StyledBox = styled(Box)(({ theme }) => css`
  position: relative;
  background-color: var(--shiki-color-background);
  padding: 26px 16px 8px;
  margin: 8px 0;
  border-radius: .4rem;
  box-shadow: ${theme.shadows[2]};
  font-family: var(--code-block-font);
`)

const ToolBtnStack = styled(Stack)`
  position: absolute;
  right: 8px;
  top: 0;
  flex-flow: row;
`

const StyledIconBtn = styled(IconButton)`
  color: inherit;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`

const ToolBtn: React.FC<ToolBtnProps> = (props) => {
  const { title, Icon, ...others } = props

  return (
    <Tooltip title={title}>
      <StyledIconBtn {...others}>
        <Icon/>
      </StyledIconBtn>
    </Tooltip>
  )
}

// map to lang defined in codeLang.ts
const LANG_MAP: Readonly<Record<string, LangType>> = Object.freeze({
  cpp: 'C++',
  python: 'Python3',
})

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { children, 'data-language': dataLng, ...others } = props
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const tooltip = useMemo(() => copied ? 'copied' : 'copy', [copied])
  const runEnabled = has(LANG_MAP, dataLng)

  const getCode = useCallback(
    () => ref.current?.querySelector('pre')?.innerText, [],
  )

  const copyAction = useCallback(async () => {
    await Promise.resolve(getCode() || Promise.reject('cannot find any code'))
      .then((v) => navigator.clipboard.writeText(v))
      .then(() => {
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [getCode])

  const runAction = (): void => {
    navigate('/play', {
      state: {
        code: getCode(),
        lang: LANG_MAP[dataLng],
      },
    })
  }

  return (
    <StyledBox ref={ref} {...others}>
      <ToolBtnStack>
        <ToolBtn title={tooltip} Icon={AssignmentOutlined} onClick={copyAction}/>
        {runEnabled && <ToolBtn title="run" Icon={CodeOutlined} onClick={runAction}/>}
      </ToolBtnStack>

      {children}
    </StyledBox>
  )
}

export default CodeBlock
