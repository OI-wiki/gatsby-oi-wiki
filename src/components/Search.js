/** @jsx jsx */
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import { fade, makeStyles, withStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import FindInPageIcon from "@material-ui/icons/FindInPage"
import React, { useState } from "react"
import { MdSearch } from "react-icons/md"
import { jsx } from "theme-ui"

const useStyles = makeStyles({})

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: "61px",
  },
  searchResultPrimary: {
    "& em": {
      fontStyle: "normal",
      color: fade(theme.palette.primary.main, .95),
      background: fade(theme.palette.primary.main, .08),
    },
  },
  searchResultSecondary: {
    "& em": {
      fontStyle: "normal",
      padding: "0 0 2px",
      boxShadow: `inset 0 -2px 0 0 ${fade(theme.palette.primary.main, .5)}`,
      // 使用 box shadow 模拟下划线
    },
  },
  resultPaper: {
    // marginTop: "12px",
    // minWidth: "500px",
    // maxWidth: "600px",
    // position: "absolute",
    // right: "0 !important",
    // top: "100%",
    // maxHeight: "70vh",
    // overflowY: "scroll",
    // overflowX: "hidden",
    // zIndex: 5
  },
})

function SearchResultList(props) {
  const { val, searched, ev, classes } = props
  return val.length !== 0 ? (
    <List>
      {val.map((item) => {
        /* Render article */
        return (
          <ListItem button divider component="a" href={item.url} key={item.url}>
            <ListItemIcon>
              <FindInPageIcon/>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  className={classes.searchResultPrimary}
                  dangerouslySetInnerHTML={{
                    __html: item.title.replace(ev, `<em>${ev}</em>`),
                  }}
                />
              }
              secondary={
                <div
                  className={classes.searchResultSecondary}
                  dangerouslySetInnerHTML={{
                    __html: item.highlight ? item.highlight : "",
                  }}
                />
              }
            />
          </ListItem>
        )
      })}
    </List>
  ) : searched ? (
    "没有找到符合条件的结果"
  ) : (
    ""
  )
}

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
    clearTimeout(this.timer)
    this.setState({
      ev: ev.target.value,
    })
    // this.timer = setTimeout(this.handleChange, 0)
    if (ev !== "") this.timer = setTimeout(this.handleChange, 500)
  }

  handleChange(w) {
    const { ev } = this.state

    let sta = [], Rsize
    const result = fetch(`https://search.oi-wiki.org:8443/?s=${encodeURIComponent(ev)}`, {
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
      }),
    )
  }

  render() {
    const { ev, val, searched } = this.state
    return (
      <>
        <TextField
          id="standard-search"
          type="search"
          style={{ margin: 0 }}
          placeholder="键入以开始搜索"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={this.update.bind(this)}
        />
        <SearchResultList ev={ev} val={val} searched={searched} classes={this.props.classes}/>
      </>
    )
  }
}

function Search(props) {
  const [dialogOpen, setDialogOpen] = useState(true)
  const classes = useStyles()
  return (
    <>
      <IconButton
        onClick={() => setDialogOpen(true)}
        className={classes.iconButton}
      >
        <MdSearch fontSize="medium"/>
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
          <Result classes={props.classes}/>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(Search)
