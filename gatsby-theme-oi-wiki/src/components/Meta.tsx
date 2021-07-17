import { makeStyles, Paper, Typography } from '@material-ui/core'
import CopyrightIcon from '@material-ui/icons/Copyright'
import EditIcon from '@material-ui/icons/Edit'
import { Group as GroupIcon, History as HistoryIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { SmartLink, SmartLinkProps } from './Link'
import Tags from './Tags'
import EditWarn from './EditWarn'
import { uniq } from '../utils/common'

const useStyles = makeStyles((theme: any) => ({
  metaIcon: {
    verticalAlign: 'sub',
  },
  paper: {
    padding: theme.spacing(2),
  },
  meta: {
    margin: '20px 0 10px',
    paddingLeft: '.5rem',
    textDecoration: 'none',
  },
  subText: {
    // make typescript and eslint happy
    lineHeight: 1.8,
  },
  authorLink: {
    color: (theme.palette as unknown as { subTitle: string }).subTitle,
    paddingLeft: theme.spacing(1),
    display: 'inline-block',
  },
}))

export interface MetaProps {
  tags: string[];
  relativePath: string;
  modifiedTime: string;
  location: Location;
  authors?: string;
  title: string;
}

const Meta: React.FC<MetaProps> = (props) => {
  const { tags, relativePath, modifiedTime, location, ...rest } = props
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

  const Author: React.FC<{ name: string }> = ({ name }) =>
    <SmartLink href={`https://github.com/${name}`} className={classes.authorLink}>
      {`@${name}`}
    </SmartLink>

  const click: SmartLinkProps['onClick'] = (e) => {
    e.preventDefault()
    setDialogOpen(true)
  }

  return <>
    <EditWarn relativePath={relativePath} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} location={location}/>
    <Paper className={classes.paper} variant="outlined">
      <Tags tags={tags}/>
      <div className={classes.meta}>
        {props.authors &&
        <Typography gutterBottom>
            <span>
              <GroupIcon fontSize="small" className={classes.metaIcon}/>
              {' 贡献者：'}
            </span>
          {uniq(props.authors.split(',').map(v => v.trim()))
            .map(name => <Author key={name} name={name}/>)
          }
        </Typography>
        }
        <Typography gutterBottom>
          <span>
            <HistoryIcon fontSize="small" className={classes.metaIcon}/>
            {' 本页面最近更新：'}
          </span>
          <span>{modifiedTime}</span>，
          <SmartLink to='./changelog/' {...rest} state={{ ...rest }}>更新历史</SmartLink>
        </Typography>

        <Typography gutterBottom>
          <span>
            <EditIcon fontSize="small" className={classes.metaIcon}/>
            {' 发现错误？想一起完善？ '}
            <SmartLink onClick={click} to=".">
              在 GitHub 上编辑此页！
            </SmartLink>
          </span>
        </Typography>

        <Typography>
          <span>
            <CopyrightIcon fontSize="small" className={classes.metaIcon}/>
            {' 本页面的全部内容在 '}
            <strong>
              <SmartLink href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">CC BY-SA 4.0</SmartLink>
              {' 和 '}
              <SmartLink href="https://github.com/zTrix/sata-license">SATA</SmartLink>
            </strong>
            {' 协议之条款下提供，附加条款亦可能应用'}
          </span>
        </Typography>
      </div>
    </Paper>
  </>
}

export default Meta
