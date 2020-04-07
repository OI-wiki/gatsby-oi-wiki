/** @jsx jsx */
import Collapse from "@material-ui/core/Collapse"
import MuiLink from "@material-ui/core/Link"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import { useTheme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import { useState } from "react"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { jsx } from "theme-ui"
import pathList from "../sidebar.yaml"

function Item(props, padding, pathname) {
  const theme = useTheme()
  const arr = Object.entries(props)[0]
  const key = arr[0],
    value = arr[1]
  if (typeof value === "string") {
    return [
      <ListItem
        button
        style={{ paddingLeft: padding }}
        selected={value === pathname}
        component={MuiLink}
        href={value}
        key={key}
        sx={{ color: theme.palette.text.primary, lineHeight: 1.2 }}
      >
        <ListItemText
          primary={
            <Typography variant={"body2"} component={"span"}>
              {key}
            </Typography>
          }
        />
      </ListItem>,
      value === pathname,
    ]
  }
  // array
  const listItemsResult = value.map((item) =>
    Item(item, padding + 16, pathname),
  )
  const shouldOpen = listItemsResult.reduce(
    (prev, [, curr]) => curr || prev,
    false,
  )
  const listItems = listItemsResult.map(([v]) => v)
  let [open, setOpen] = useState(shouldOpen)
  return [
    <div key={key}>
      <ListItem
        button
        onClick={() => setOpen(!open)}
        sx={{ paddingLeft: padding, lineHeight: 1.2 }}
      >
        <ListItemText
          primary={
            <Typography variant={"body2"} component={"span"}>
              {key}
            </Typography>
          }
        />
        {open ? <MdExpandLess/> : <MdExpandMore/>}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>{listItems}</List>
      </Collapse>
    </div>,
    shouldOpen,
  ]
}

export default function(props) {
  return (
    <List sx={{ width: "100%", height: "100%" }}>
      {pathList.map((item) => Item(item, 16, props.pathname))}
    </List>
  )
}
