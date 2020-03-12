/** @jsx jsx */
import Link from "./Link"
import { jsx } from "theme-ui"
import { Menu } from "antd"
import pathList from "../footer.yaml"
import { Row } from "antd"

function Item(props) {
  const items = props
  const arr = Object.entries(items)[0]
  const key = arr[0],
    value = arr[1]
  if (typeof value === "string") {
    return (
      <Menu.Item key={key}>
        <Link
          to={value}
          sx={{
            color: "#304455!important",
          }}
        >
          {key}
        </Link>
      </Menu.Item>
    )
    return ret
  }
  // array
  return (
    <SubMenu
      key={key}
      title={
        <h3
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#273849",
          }}
        >
          {key}
        </h3>
      }
    >
      {value.map(item => Item(item))}
    </SubMenu>
  )
  return ret
}

function openkey(props, pathname) {
  const items = props
  const arr = Object.entries(items)[0]
  const key = arr[0],
    value = arr[1]
  if (typeof value === "string") {
    if (value === pathname) return [key]
    return null
  }
  var ret = null
  value.forEach(item => {
    var k = openkey(item, pathname)
    if (k != null) ret = k
  })
  if (ret != null) ret.push(key)
  return ret
}

export default function(props) {
  // console.log(pathList)
  pathList.map(item => Item(item))
  var okey = null
  pathList.forEach(item => {
    var k = openkey(item, props.pathname)
    if (k != null) okey = k
  })
  if (okey == null) okey = []
  return (
    <Sider
      breakpoint="xl"
      collapsedWidth="0"
      onBreakpoint={broken => {
        // console.log(broken)
      }}
      onCollapse={(collapsed, type) => {
        // console.log(collapsed, type)
      }}
      theme="light"
      width="300px"
      {...props}
    >
      <Row type="flex" justify="space-around">
        {pathList.map(item => Item(item))}
      </Row>
    </Sider>
  )
}
