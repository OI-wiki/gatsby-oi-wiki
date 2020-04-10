/** @jsx jsx */
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { jsx } from "theme-ui"

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5),
  },
}))

function AuthorsArray({ authors }) {
  const arr = authors && authors.split(",").map(x => x.trim())
  const classes = useStyles()
  return (
    <div>
      {arr &&
      arr.map((author) => (
        <Chip
          label={` @${author} `}
          key={author}
          clickable
          className={classes.chip}
          component={"a"}
          variant="outlined"
          href={"https://github.com/" + author.trim()}
        />
      ))}
    </div>
  )
}

export default AuthorsArray
