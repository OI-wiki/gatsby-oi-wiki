/** @jsx jsx */
import Link from './Link';
import { jsx } from "theme-ui";
import { Layout, Menu, Icon } from "antd"
import pathList from '../sidebar.yaml';
import SubMenu from 'antd/lib/menu/SubMenu';
import Sider from 'antd/lib/layout/Sider';

function Item(props) {
  // console.log(item);
  const {item, ...other} = props;
  const arr = Object.entries(item)[0];
  // console.log(arr);
  const key = arr[0], value = arr[1];
  // console.log(value);
  // if (value.length)
  if (typeof(value) === "string") {
    var ret=(<Menu.Item key={key} {...other}>
        <Link to={value}>
            <span>
                {key}
            </span>
        </Link>
    </Menu.Item>)
      console.log('ret',ret);
      return ret
  }
  // array
  var ret=(<SubMenu key={key} title={<span>{key}</span>} {...other}>
    {value.map(item => (
      <Item item={item} {...other}/>
    ))}
  </SubMenu>)
  console.log('ret-submenu',ret);
    return ret;
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
      <Link to="/blog"></Link>
      <div className="logo" />
      <Menu theme="light" defaultSelectedKeys={["item_3"]} mode="inline" style={{ height: '100%', borderRight: 0 }}>
        {pathList.map(item => (
          <Item item={item} />
        ))}
      </Menu>
    </Sider>
  );
}
