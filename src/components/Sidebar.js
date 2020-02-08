/** @jsx jsx */
import Link from './Link';
import { jsx } from "theme-ui";
import { Layout, Menu, Icon } from "antd"
import pathList from '../sidebar.yaml';
import SubMenu from 'antd/lib/menu/SubMenu';
import Sider from 'antd/lib/layout/Sider';

function Item(props) {
  // console.log(props);
  // const {items, ...other} = props;
  // console.log(items, other);
  const items = props
  const arr = Object.entries(items)[0];
  // console.log(arr);
  const key = arr[0], value = arr[1];
  // console.log(value);
  // if (value.length)
  if (typeof(value) === "string") {
    return (<Menu.Item key={key}>
        <Link to={value}>
            <span>
                {key}
            </span>
        </Link>
    </Menu.Item>)
  }
  // array
  return (<SubMenu key={key} title={<span>{key}</span>}>
    {value.map(item => (
      Item(item)
    ))}
  </SubMenu>)
}

export default function(props) {
  // console.log(pathList)
  return (
    <Sider
      breakpoint="xl"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      theme="light"
      width="19%"
      {...props}
    >
      <Link to="/"></Link>
      <div className="logo" />
      <Menu theme="light" defaultSelectedKeys={["1"]} defaultOpenKeys={["数学", "多项式", "Theme Guide"]} mode="inline" style={{ height: '100%', borderRight: 0 }}>
        {pathList.map(item => (
          Item(item)
        ))}
      </Menu>
    </Sider>
  );
}
