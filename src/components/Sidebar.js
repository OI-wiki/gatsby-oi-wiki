/** @jsx jsx */
import Link from "./Link"
import { jsx } from "theme-ui"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Collapse from "@material-ui/core/Collapse"
import ListItemText from "@material-ui/core/ListItemText"
import pathList from "../sidebar.yaml"
import { useState } from "react"
import { MdExpandMore, MdExpandLess } from "react-icons/md"

function Item(props, padding, pathname) {
  const items = props
  const arr = Object.entries(items)[0]
  const key = arr[0],
    value = arr[1]
  if (typeof value === "string") {
    return [
      <Link
        to={value}
        sx={{
          color: "#304455!important",
        }}
        key={key}
      >
        <ListItem
          button
          style={{ paddingLeft: padding }}
          selected={value === pathname}
        >
          <ListItemText primary={key} />
        </ListItem>
      </Link>,
      value === pathname,
    ]
  }
  // array
  const listItemsResult = value.map((item) =>
    Item(item, padding + 16, pathname)
  )
  const shouldOpen = listItemsResult.reduce(
    (prev, [, curr]) => curr || prev,
    false
  )
  const listItems = listItemsResult.map(([v]) => v)
  let [open, setOpen] = useState(shouldOpen)
  return [
    <div key={key}>
      <ListItem
        button
        onClick={() => setOpen(!open)}
        style={{ color: "rgb(48, 68, 85)", paddingLeft: padding }}
      >
        <ListItemText primary={key} />
        {open ? <MdExpandLess /> : <MdExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>{listItems}</List>
      </Collapse>
    </div>,
    shouldOpen,
  ]
}
export default function (props) {
  return (
    <List sx={{ width: "100%", height: "100%" }}>
      {pathList.map((item) => Item(item, 16, props.pathname))}
    </List>
  )
}
