import { Paper, Typography, makeStyles } from '@material-ui/core'
import CopyrightIcon from '@material-ui/icons/Copyright'
import EditIcon from '@material-ui/icons/Edit'
import { Group as GroupIcon, History as HistoryIcon } from '@material-ui/icons'
import React, { useState } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import LinkGetter from './Link'
import Tags from './Tags'
import EditWarn from './EditWarn'

/**
 * 对**排序后**的数组去重
 *
 * @template T
 * @param {Array<T>} a
 * @return {Array<T>}
 */
const unique = function <T> (a: Array<T>): Array<T> {
  return a.filter((val, i, arr) => i === 0 || arr[i - 1] !== val)
}

const useStyles = makeStyles((theme: any) => ({
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
    color: theme.palette.link.default,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.link.hover,
    },
    '&.active': {
      color: theme.palette.text.primary,
    },
    transition: `color ${250}ms ease-in-out`,
  },
  subText: {
    // make typescript and eslint happy
    lineHeight: 1.8,
  },
  authorLink: {
    color: (theme.palette as unknown as {subTitle: string}).subTitle,
    paddingLeft: theme.spacing(1),
    display: 'inline-block',
  },
}))

interface Props {
  tags: string[];
  relativePath: string;
  modifiedTime: string;
  location: string;
  authors?: string;
}
const Meta: React.FC<Props> = (props: Props) => {
  const { tags, relativePath, modifiedTime, location, ...rest } = props
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)
  const Link = LinkGetter(props.location)

  const Author: React.FC<{name: string}> = ({ name }) => {
    const trimedName = name.trim()
    return (
      <Link href={`https://github.com/${trimedName}`} className={classes.authorLink}>
        {`@${trimedName}`}
      </Link>
    )
  }
  return <>
    <EditWarn relativePath={relativePath} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} location={location} />
    <Paper className={classes.paper} variant="outlined">
      <Tags tags={tags} />
      <div className={classes.meta}>
        {props.authors &&
          <Typography gutterBottom>
            <span>
              <GroupIcon fontSize="small" className={classes.metaicon} />
              {' 贡献者: '}
            </span>
            {unique(props.authors.split(',').sort()).map(name => <Author key={name} name={name} />)}
          </Typography>
        }
        <Typography gutterBottom>
          <span>
            <HistoryIcon fontSize="small" className={classes.metaicon} />
            {' 本页面最近更新：'}
          </span>
          <span>{modifiedTime}</span>，
          <GatsbyLink to='./changelog/' className={classes.link} {...rest} state={{ ...rest }}>更新历史</GatsbyLink>
        </Typography>

        <Typography gutterBottom>
          <span>
            <EditIcon fontSize="small" className={classes.metaicon} />
            {' 发现错误？想一起完善？ '}
            <GatsbyLink
              onClick={(e) => {
                e.preventDefault()
                setDialogOpen(true)
              }}
              className={classes.link} to="."
            >
              在 GitHub 上编辑此页！
            </GatsbyLink>
          </span>
        </Typography>

        <Typography>
          <span>
            <CopyrightIcon fontSize="small" className={classes.metaicon} />
            {' 本页面的全部内容在 '}
            <strong>
              <Link href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh">CC BY-SA 4.0</Link>
              {' 和 '}
              <Link href="https://github.com/zTrix/sata-license">SATA</Link>
            </strong>
            {' 协议之条款下提供，附加条款亦可能应用'}
          </span>
        </Typography>
      </div>
    </Paper>
  </>
}

export default Meta
