/** @jsx jsx */
import Dialog from "@material-ui/core/Dialog"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import { useTheme } from "@material-ui/core/styles"
import { jsx } from "theme-ui"
import React, { useState } from "react"
import Link from "./Link"
import { withStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"

import IconButton from "@material-ui/core/IconButton"
import { MdSearch } from "react-icons/md"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({})

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: "61px",
  },
})

class Result extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ev: "",
      val: [],
      searched: false,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  update(ev) {
    // console.log(ev.type)
    // if (ev.type === "focus" || ev.type === "keyup") {
    clearTimeout(this.timer)
    this.setState({
      ev: ev.target.value,
    })
    // this.timer = setTimeout(this.handleChange, 0)
    if (ev != "") this.timer = setTimeout(this.handleChange, 500)
  }

  handleChange(w) {
    const { ev } = this.state

    let sta = [],
      Rsize
    const result = fetch(`https://search.oi-wiki.org:8443/?s=${ev}`, {
      // credentials: "same-origin"
    })
      .then((response) => response.json())
      .then((result) => {
        Rsize = result.length
        return result
      })

    result.then((val) =>
      this.setState({
        val: val,
        searched: true,
      })
    )
  }

  render() {
    // console.log(this.state.val[0])
    const { ev, val, searched } = this.state
    // console.log(searched)
    // console.log(val[0])
    return (
      <>
        <TextField
          id="standard-full-width"
          style={{ margin: 0 }}
          placeholder="搜索..."
          helperText="键入以开始搜索"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={this.update.bind(this)}
        />

        {val.length != 0 ? (
          <List>
            {val.map((item) => {
              /* Render article */
              return (
                <ListItem button class="md-search-result__item">
                  <a
                    href={item.url}
                    title={item.title}
                    class="md-search-result__link"
                    tabindex="-1"
                  >
                    <article
                      class="md-search-result__article
                      md-search-result__article--document"
                    >
                      <h1
                        class="md-search-result__title"
                        dangerouslySetInnerHTML={{
                          __html: item.title.replace(ev, `<em>${ev}</em>`),
                        }}
                      ></h1>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.highlight ? item.highlight : "",
                        }}
                      ></div>
                    </article>
                  </a>
                </ListItem>
              )
            })}
          </List>
        ) : searched ? (
          "没有找到符合条件的结果"
        ) : (
          ""
        )}
      </>
    )
  }
}

function Search() {
  const [dialogOpen, setDialogOpen] = useState(true)
  const classes = useStyles()
  return (
    <>
      <IconButton
        onClick={() => setDialogOpen(true)}
        className={classes.iconButton}
      >
        <MdSearch fontSize="medium" />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
        }}
        fullWidth={true}
      >
        <DialogTitle>{"搜索"}</DialogTitle>
        <DialogContent>
          <Result></Result>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(Search)
