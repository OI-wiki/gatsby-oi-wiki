import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import AccessTime from '@material-ui/icons/AccessTime'
import Storage from '@material-ui/icons/Storage'
import React from 'react'
import type { TransformedResponseData } from '../lib/play/useRunner'
import Indicator, { IndicatorProps } from './Indicator'
import useDarkMode from '../lib/useDarkMode'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 240,
    maxHeight: 400,
    overflow: 'auto',
    padding: `0 ${theme.spacing(2)}px`,
    '& > pre': {
      margin: 0,
      paddingBottom: theme.spacing(2),
      fontSize: 14,
    },
  },
  statusLine: {
    '& > *': {
      margin: `${theme.spacing(1)}px 0`,
    },
  },
  basicInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  basicInfoSm: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  measurement: ({ darkMode }: { darkMode: boolean }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    color: theme.palette.grey[darkMode ? 400 : 600],
    '& > svg': {
      marginLeft: 16,
      marginRight: 4,
    },
  }),
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

const Output = React.forwardRef<
  unknown,
  { output: TransformedResponseData | null }
>(({ output }, ref) => {
  const classes = useStyles({ darkMode: useDarkMode() })
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('xs'))

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
      <Grid container className={classes.statusLine}>
        <Grid item>
          <Typography variant="h6">提交详情</Typography>
        </Grid>
        <Box
          className={clsx(classes.basicInfo, {
            [classes.basicInfoSm]: matches,
          })}
        >
          <Indicator type={statusSeverityMap[status]} msg={status} />
          <Box style={matches ? { marginTop: 8, marginBottom: -28 } : {}}>
            <Box className={classes.measurement}>
              <AccessTime fontSize="small" />
              <Typography display="inline">{time}ms</Typography>
            </Box>
            <Box className={classes.measurement}>
              <Storage fontSize="small" />
              <Typography display="inline">{memory}KB</Typography>
            </Box>
          </Box>
        </Box>
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
      <Typography className={classes.outTitle}>输出</Typography>
      <Divider />
      <pre>{stdout === '' ? '似乎没有输出哦...' : stdout}</pre>
    </Paper>
  )
})

export default Output
