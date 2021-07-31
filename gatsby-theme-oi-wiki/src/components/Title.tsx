import React, { useState } from 'react'
import { createStyles, Grid, Hidden, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import EditWarn from './EditWarn'

export interface TitleProps {
  title: string,
  noEdit: boolean,
  noMeta?: boolean,
  relativePath: string,
  location: Location,
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
    color: theme.palette.subTitle,
    lineHeight: 1.8,
  },
}))

const Title: React.FC<TitleProps> = (props) => {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { relativePath, location, title, noEdit } = props

  return (
    <>
      <EditWarn
        relativePath={relativePath}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        location={location}
      />
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography variant="h4" className={classes.boldText} component="h1">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {!noEdit &&
          <Hidden xsDown implementation="css">
            <Tooltip title="编辑页面" placement="left" arrow>
              <IconButton
                onClick={() => setDialogOpen(true)}
                className={classes.iconButton}
              >
                <EditIcon fontSize="small"/>
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
