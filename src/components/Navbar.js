/** @jsx jsx */
import React from 'react';
import ReactDOM from 'react-dom';
import { jsx } from "theme-ui"
import navbarData from "../navbar.yaml"
import navbarSubData from "../navbarSub.yaml"
import Link from "./Link"
import { MdSchool } from "react-icons/md"
import theme from "../theme"
import classNames from 'classnames'
import { Menu, Input } from 'antd'
import { EditFilled, CaretDownFilled } from '@ant-design/icons'
// import algoliasearch from 'algoliasearch/lite';
// import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
const { SubMenu } = Menu;
const { Search } = Input;

// const searchClient = algoliasearch(
//   'latency',
//   '6be0576ff61c053d5f9a3225e2a90f76'
// );

class Navbar extends React.Component {
  state = {
    current: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };
  render() {
    return (

      <nav
        aria-label="Navbar Menu"
        sx={{
          boxShadow:
            "0 0 0.2rem rgba(0,0,0,.1), 0 0.2rem 0.4rem rgba(0,0,0,.2)",
          width: "100%",
          padding: "0 3%"
        }}
      >
        <div
          sx={{ color: "black" }}
          className="nav-firstrow"
        >
          <ul sx={theme.layout.navbar.navList}>
            <Link
              href='/'
              sx={{
                float: "left",
                fontSize: "large",
                color: "black",
              }}
            >
              <MdSchool
                className="logo"
                size={30}
                sx={{ m: "0.5rem 1rem 0.5rem 1rem" }}
              ></MdSchool>
            </Link>
            <Link href='/'
              sx={{
                color: "text",
                ":hover": {
                  color: "#1E90FF",
                  textDecoration: "none"
                }
              }}
            >OI WiKi</Link>
            <Menu
              sx={{ float: "right" }}
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              className={'hide-nav-on-xs'}
            >
              <Menu.Item key="menu-search">
                <Search
                  placeholder="键入进行搜索"
                  onSearch={value => /*console.log(value)*/ value}
                  style={{ width: 200 }}
                />
              </Menu.Item>

              <SubMenu
                title={
                  <span className="submenu-title-wrapper">
                    <EditFilled />
                    学习文档
                    <CaretDownFilled />
                  </span>
                }
              >
                {navbarSubData.items.map(item => (
                  <Menu.Item key={item.link}>
                    <Link to={item.link}>
                      {item.title}
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>

              {navbarData.items.map(item => (
                <Menu.Item key={item.link}
                  className={classNames({
                    'link': true,
                  })}
                >
                  <Link to={item.link} >
                    {item.title}
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar
