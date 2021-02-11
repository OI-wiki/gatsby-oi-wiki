import {Paper, Typography, makeStyles} from '@material-ui/core'
import lightBlue from '@material-ui/core/colors/lightBlue'
import CopyrightIcon from '@material-ui/icons/Copyright'
import EditIcon from '@material-ui/icons/Edit'
import HistoryIcon from '@material-ui/icons/History'
import React, {useState} from 'react'
import {Link as GatsbyLink} from 'gatsby'
import Link from './Link'
import Tags from './Tags'
import EditWarn from './EditWarn'

const useStyles = makeStyles((theme) => ({
  metaicon: {
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
  link: {
    color: lightBlue[500],
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
    '&.active': {
      color: theme.palette.text.primary,
    },
  },
}))

interface Props {
  tags: string[];
  relativePath: string;
  modifiedTime: string;
  location: string;
}
const Meta: React.FC<Props> = (props: Props) => {
  const {tags, relativePath, modifiedTime, location, ...rest} = props
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)
  const MyLink = Link(location)
  return <>
    <EditWarn relativePath={relativePath} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} location={location} />
    <Paper className={classes.paper} variant="outlined">
      <Tags tags={tags} />
      <div className={classes.meta}>
        <Typography gutterBottom>
          <span>
            <HistoryIcon fontSize="small" className={classes.metaicon} />
              本页面最近更新：
          </span>
          <span>{modifiedTime}</span>，
        <GatsbyLink to='./changelog/' className={classes.link} {...rest} state={{...rest}}>更新历史</GatsbyLink>
        </Typography>

        <Typography gutterBottom>
          <span>
            <EditIcon fontSize="small" className={classes.metaicon} />
              发现错误？想一起完善？{' '}
            <MyLink onClick={(e) => {
              e.preventDefault()
              setDialogOpen(true)
            }} className={classes.link} to=".">
              在 GitHub 上编辑此页！
          </MyLink>
          </span>
        </Typography>

        <Typography>
          <span>
            <CopyrightIcon fontSize="small" className={classes.metaicon} />
              本页面的全部内容在{' '}
            <strong>
              <MyLink href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">
                CC BY-SA 4.0
            </MyLink>{' '}
                和 <MyLink href="https://github.com/zTrix/sata-license">SATA</MyLink>
            </strong>{' '}
              协议之条款下提供，附加条款亦可能应用
        </span>
        </Typography>
      </div>
    </Paper>
  </>
}

export default Meta
