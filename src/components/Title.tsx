import React, { useState } from 'react'
import { makeStyles, Typography, Link, createStyles, Grid, Tooltip, IconButton, Hidden } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import EditWarn from './EditWarn'
type Props = {
  title: string,
  modifiedTime?: string,
  authors?: string,
  noEdit: string,
  noMeta?: string,
  relativePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any,
}

const useStyles = makeStyles((theme) => createStyles({
  boldText: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  subText: {
    color: (theme.palette as unknown as { subTitle: string }).subTitle,
    // make typescript and eslint happy
    lineHeight: 1.8,
  },
  authorLink: {
    color: (theme.palette as unknown as {subTitle: string}).subTitle,
    textDecoration: 'underline',
    paddingLeft: theme.spacing(1),
    display: 'inline-block',
  },
  iconButton: {
    float: 'right',
  },
}))

const Title: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)
  const Author: React.FC<{ name: string }> = ({ name }) => {
    const trimedName = name.trim()
    return (
      <Link href={`https://github.com/${trimedName}`} className={classes.authorLink}>{`@${trimedName}`}</Link>
    )
  }

  return (
    <>
      <EditWarn
        relativePath={props.relativePath}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        location={props.location}
      />
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography variant="h4" className={classes.boldText} component="h1">
            {props.title}
          </Typography>
          {
            props.noMeta === 'false' &&
            props.modifiedTime &&
            <Typography variant="body2" className={classes.subText}>
              本页面最后更新于: {props.modifiedTime}
            </Typography>
          }
          {
            props.authors &&
            <Typography variant="body2" className={classes.subText}>
              作者: { props.authors.split(',').map(name => <Author key={name} name={name} />)}
            </Typography>
          }
        </Grid>
        <Grid item xs={1}>
          {
            props.noEdit === 'false' &&
            <Hidden xsDown implementation="css">
              <Tooltip title="编辑页面" placement="left" arrow>
                <IconButton
                  onClick={() => setDialogOpen(true)}
                  className={classes.iconButton}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Hidden>
          }
        </Grid>
      </Grid>

    </>
  )
}

export default Title
