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

function Header({ num }) {
  if (num <= 0) return <span>本页面未记录贡献者</span>
  if (num === 1) return <span>贡献者：</span>
  if (num > 1) return <span>贡献者们：</span>
}

function AuthorsArray({ authors }) {
  const arr = authors && authors.split(",")
  const classes = useStyles()
  return (
    <div>
      <Header num={arr ? arr.length : 0}/>
      <div>
        {arr &&
        arr.map((author) => (
          <Chip
            label={` ${author} `}
            key={author}
            clickable
            className={classes.chip}
            component={"a"}
            variant="outlined"
            href={"https://github.com/" + author.trim()}
          />
        ))}
      </div>
    </div>
  )
}

export default AuthorsArray
