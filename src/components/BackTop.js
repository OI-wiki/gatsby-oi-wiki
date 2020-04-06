/** @jsx jsx */
import Fab from "@material-ui/core/Fab"
import ArrowUpward from "@material-ui/icons/ArrowUpward"
import { jsx } from "theme-ui"
import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import useThrottledOnScroll from "../lib/useThrottledOnScroll"
import Zoom from "@material-ui/core/Zoom"

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    [theme.breakpoints.down("sm")]: {
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
    bottom: theme.spacing(8),
    right: theme.spacing(8),
    zIndex: 2,
  },
}))
export default function() {
  const classes = useStyles()
  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }
  const [yPos, setyPos] = useState(0)
  useThrottledOnScroll(() => setyPos(window.scrollY), 166)
  return (
    <Zoom in={yPos > 400}>
      <Fab className={classes.fab} onClick={handleClick}>
        <ArrowUpward/>
      </Fab>
    </Zoom>
  )
}
