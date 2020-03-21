/** @jsx jsx */
import Link from "./Link"
import { jsx } from "theme-ui"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import Collapse from "@material-ui/core/Collapse"
import ListItemText from "@material-ui/core/ListItemText"
import pathList from "../sidebar.yaml"
import { Layout } from "antd"
const { Sider } = Layout
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
      >
        <ListItem
          key={key}
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
  const listItemsResult = value.map(item => Item(item, padding + 16, pathname))
  const shouldOpen = listItemsResult.reduce(
    (prev, [, curr]) => curr || prev,
    false
  )
  const listItems = listItemsResult.map(([v]) => v)
  let [open, setOpen] = useState(shouldOpen)
  return [
    <div>
      <ListItem
        button
        key={key}
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
export default function(props) {
  return (
    <Sider
      breakpoint="xl"
      collapsedWidth="0"
      theme="light"
      width="300px"
      sx={{
        height: "100%",
        overflow: "auto",
      }}
      {...props}
    >
      <List sx={{ width: "100%" }}>
        {pathList.map(item => Item(item, 16, props.pathname))}
      </List>
    </Sider>
  )
}
