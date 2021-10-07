import React from 'react'
import type { TransformedResponseData } from './useRunner'
import Indicator, { IndicatorProps } from './Indicator'
import { Nullable } from '../../types/common'
import styled from '@mui/material/styles/styled'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { theme } from '../../theme'
import { css } from '@emotion/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccessTime from '@mui/icons-material/AccessTime'
import Storage from '@mui/icons-material/Storage'
import Divider from '@mui/material/Divider'

const StyledPaper = styled(Paper)(({ theme }) => css`
  min-height: 240px;
  max-height: 400px;
  overflow: auto;
  padding: 0 ${theme.spacing(2)};
`)

const StyledPre = styled('pre')(({ theme }) => css`
  margin: 0;
  padding-bottom: ${theme.spacing(2)};
  font-size: 0.85rem;
`)

const StatusLineGrid = styled(Grid)`
  justify-content: space-between;

  & > * {
    margin: ${theme.spacing(1)}px 0;
  }
`

const BasicInfoGrid = styled(Grid)(({ theme }) => css`
  flex-flow: row;
  align-items: center;
  margin-left: auto;

  ${theme.breakpoints.down('xs')} {
    align-items: flex-end;
    flex-flow: column;
  }
`)

const MeasurementContainerBox = styled(Box)(({ theme }) => css`
  ${theme.breakpoints.down('xs')} {
    margin-top: 0;
    margin-bottom: -28px;
  }
`)

const MeasurementBox = styled(Box)(({ theme }) => css`
  display: inline-flex;
  align-items: center;
  color: ${theme.palette.grey[600]};

  @media (prefers-color-scheme: dark) {
    color: ${theme.palette.grey[400]};
  }

  & > svg {
    margin-left: 16px;
    margin-right: 4px;
  }
`)

const CompilationTitle = styled(Typography)(({ theme }) => css`
  color: ${theme.palette.warning.dark};
  font-weight: bold;
`)

const ErrorTitle = styled(Typography)(({ theme }) => css`
  color: ${theme.palette.error.dark};
  font-weight: bold;
`)

const OutTitle = styled(Typography)(({ theme }) => css`
  color: ${theme.palette.info.dark};
  font-weight: bold;
`)

const statusSeverityMap: Record<TransformedResponseData['status'] | 'No Status Info',
  IndicatorProps['type']> = Object.freeze({
  'Compile Error': 'warning',
  'Run Finished': 'success',
  'Time Limit Exceeded': 'error',
  'Memory Limit Exceeded': 'error',
  'Runtime Error': 'error',
  'Execute Failure': 'error',
  'No Status Info': 'info',
})

interface OutputProps {
  output: Nullable<TransformedResponseData>
}

const Output = React.forwardRef<HTMLDivElement, OutputProps>(({ output }, ref) => {
  const {
    time = '?',
    memory = '?',
    status = 'No Status Info',
    ceInfo,
    stdout,
    stderr,
  } = output || {}

  return (
    <StyledPaper ref={ref}>
      <StatusLineGrid container={true}>
        <Grid item={true}>
          <Typography variant="h6">提交详情</Typography>
        </Grid>
        <BasicInfoGrid container={true} item={true} width="auto">
          <Indicator type={statusSeverityMap[status]} msg={status}/>
          <MeasurementContainerBox>
            <MeasurementBox>
              <AccessTime fontSize="small"/>
              <Typography display="inline">{time}ms</Typography>
            </MeasurementBox>
            <MeasurementBox>
              <Storage fontSize="small"/>
              <Typography display="inline">{memory}KB</Typography>
            </MeasurementBox>
          </MeasurementContainerBox>
        </BasicInfoGrid>
      </StatusLineGrid>

      {ceInfo && (
        <>
          <CompilationTitle>编译信息</CompilationTitle>
          <Divider/>
          <StyledPre>{ceInfo}</StyledPre>
        </>
      )}
      {stderr && (
        <>
          <ErrorTitle>错误信息</ErrorTitle>
          <Divider/>
          <StyledPre>{stderr}</StyledPre>
        </>
      )}
      <OutTitle>输出</OutTitle>
      <Divider/>
      <StyledPre>{stdout === '' ? '似乎没有输出哦...' : stdout}</StyledPre>
    </StyledPaper>
  )
})

export default Output
