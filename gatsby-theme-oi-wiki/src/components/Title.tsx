import React, { useState } from 'react'
import { makeStyles, Typography, createStyles, Grid, Tooltip, IconButton, Hidden } from '@material-ui/core'
import LinkGetter from './Link'
import EditIcon from '@material-ui/icons/Edit'
import EditWarn from './EditWarn'
type Props = {
  title: string,
  noEdit: string,
  noMeta?: string,
  relativePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location: any,
}

const useStyles = makeStyles((theme) => createStyles({
  boldText: {
    fontWeight: 'bold',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  iconButton: {
    float: 'right',
    padding: 0,
    margin: 12,
  },
  subText: {
    color: (theme.palette as unknown as {subTitle: string}).subTitle,
    // make typescript and eslint happy
    lineHeight: 1.8,
  },
}))

const Title: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)

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
