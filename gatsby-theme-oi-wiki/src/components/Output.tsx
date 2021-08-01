import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import { AccessTime, Storage } from '@material-ui/icons'
import React from 'react'
import type { TransformedResponseData } from '../lib/play/useRunner'
import { Indicator, IndicatorProps } from './Indicator'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 240,
    maxHeight: 400,
    overflow: 'auto',
    padding: `0 ${theme.spacing(2)}px`,
    '& > pre': {
      margin: 0,
      paddingBottom: theme.spacing(2),
    },
  },
  statusLine: {
    margin: `${theme.spacing(1)}px 0`,
  },
  measurement: {
    display: 'inline-flex',
    alignItems: 'center',
    color: theme.palette.grey[600],
    '& > svg': {
      marginLeft: 16,
      marginRight: 4,
    },
  },
  compilationTitle: {
    color: theme.palette.warning.dark,
    fontWeight: 'bold',
  },
  errorTitle: {
    color: theme.palette.error.dark,
    fontWeight: 'bold',
  },
  outTitle: {
    color: theme.palette.info.dark,
    fontWeight: 'bold',
  },
}))

const statusSeverityMap: Record<
  TransformedResponseData['status'] | 'No Status Info',
  IndicatorProps['type']
> = Object.freeze({
  'Compile Error': 'warning',
  'Run Finished': 'success',
  'Time Limit Exceeded': 'error',
  'Memory Limit Exceeded': 'error',
  'Runtime Error': 'error',
  'Execute Failure': 'error',
  'No Status Info': 'info',
})

export const Output = React.forwardRef<
  unknown,
  { output: TransformedResponseData | null }
>(({ output }, ref) => {
  const classes = useStyles()

  const {
    time = '?',
    memory = '?',
    status = 'No Status Info',
    ceInfo,
    stdout,
    stderr,
  } = output || {}

  return (
    <Paper ref={ref} className={classes.root}>
      <Grid container alignItems="center" className={classes.statusLine}>
        <Grid item style={{ flexGrow: 1 }}>
          <Typography variant="h6">提交详情</Typography>
        </Grid>
        <Grid item>
          <Indicator type={statusSeverityMap[status]} msg={status} />
        </Grid>
        <Grid item>
          <Box className={classes.measurement}>
            <AccessTime fontSize="small" />
            <Typography display="inline">{time}ms</Typography>
          </Box>
          <Box className={classes.measurement}>
            <Storage fontSize="small" />
            <Typography display="inline">{memory}KB</Typography>
          </Box>
        </Grid>
      </Grid>
      {ceInfo && (
        <>
          <Typography className={classes.compilationTitle}>编译信息</Typography>
          <Divider />
          <pre>{ceInfo}</pre>
        </>
      )}
      {stderr && (
        <>
          <Typography className={classes.errorTitle}>错误信息</Typography>
          <Divider />
          <pre>{stderr}</pre>
        </>
      )}
      {stdout && (
        <>
          <Typography className={classes.outTitle}>输出</Typography>
          <Divider />
          <pre>{stdout}</pre>
        </>
      )}
      <pre></pre>
    </Paper>
  )
})
