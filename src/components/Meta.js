import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import CopyrightIcon from '@material-ui/icons/Copyright'
import EditIcon from '@material-ui/icons/Edit'
import HistoryIcon from '@material-ui/icons/History'
import React, { useState } from 'react'

import AuthorsArray from './AuthorsArray'
import Link from './Link'
import Tags from './Tags'
import EditWarn from './EditWarn'

const useStyles = makeStyles((theme) => ({
  metaicon: {
    verticalAlign: 'text-top',
  },
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  meta: {
    margin: '20px 0',
    paddingLeft: '.5rem',
    textDecoration: 'none',
  },
}))

function Meta ({ authors, tags, relativePath, modifiedTime, noMeta }) {
  const historyURL = 'https://github.com/OI-wiki/OI-wiki/commits/master/docs/'
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)
  if (noMeta === 'false') {
    return (
      <>
        <EditWarn relativePath={relativePath} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        <Paper className={classes.paper} variant="outlined">
          <AuthorsArray authors={authors} />
          <Divider className={classes.divider} />
          <Tags tags={tags} />
          <div className={classes.meta}>
            <span>
              <HistoryIcon fontSize="small" className={classes.metaicon} />
              本页面最近更新：
            </span>
            <span>{modifiedTime}</span>，
            <Link href={historyURL + relativePath}>更新历史</Link>
            <br />
            <span>
              <EditIcon fontSize="small" className={classes.metaicon} />
              发现错误？想一起完善？{' '}
              <Link to="javascript:void(0)" onClick={() => setDialogOpen(true)} className={classes.link}>
                在 GitHub 上编辑此页！
              </Link>
            </span>
            <br />
            <span>
              <CopyrightIcon fontSize="small" className={classes.metaicon} />
              本页面的全部内容在{' '}
              <strong>
                <Link href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">
                  CC BY-SA 4.0
                </Link>{' '}
                和 <Link href="https://github.com/zTrix/sata-license">SATA</Link>
              </strong>{' '}
              协议之条款下提供，附加条款亦可能应用
            </span>
          </div>
        </Paper>
      </>
    )
  } else return <div />
}

export default Meta
