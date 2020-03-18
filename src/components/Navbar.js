/** @jsx jsx */
import React from "react"
import ReactDOM from "react-dom"
import { jsx } from "theme-ui"
import navbarData from "../navbar.yaml"
import navbarSubData from "../navbarSub.yaml"
import Link from "./Link"
import { MdMenu, MdSchool } from "react-icons/md"
import theme from "../theme"
import classNames from "classnames"
import { Menu, Input } from "antd"
import { EditFilled, CaretDownFilled } from "@ant-design/icons"
// import algoliasearch from 'algoliasearch/lite';
// import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
const { SubMenu } = Menu
const { Search } = Input

// const searchClient = algoliasearch(
//   'latency',
//   '6be0576ff61c053d5f9a3225e2a90f76'
// );

class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    current: "mail",
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    })
  }
  render() {
    return (
      <nav
        aria-label="Navbar Menu"
        sx={{
          boxShadow:
            "0 0 0.2rem rgba(0,0,0,.1), 0 0.2rem 0.4rem rgba(0,0,0,.2)",
          width: "100%",
          padding: "0 24px",
        }}
      >
        <div sx={{ color: "black" }} className="nav-firstrow">
          <ul sx={theme.layout.navbar.navList}>
            <a
              sx={theme.layout.navbar.toggleSider}
              onClick={this.props.toggleSider}
            >
              <MdMenu size={24} sx={{ m: "0.85rem 1rem 0rem 0rem" }}></MdMenu>
            </a>
            <a href="/" sx={theme.layout.navbar.logo}>
              <MdSchool
                className="logo"
                size={30}
                sx={{ m: "0.5rem 1rem 0.5rem 1rem" }}
              ></MdSchool>
            </a>
            <Link
              href="/"
              sx={{
                color: "black",
                ":hover": {
                  color: "#1E90FF",
                  textDecoration: "none",
                },
                fontSize: "22px",
              }}
            >
              OI Wiki
            </Link>
            <Menu
              sx={{ float: "right" }}
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
              className={"hide-nav-on-xs"}
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
                    <Link to={item.link}>{item.title}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>

              {navbarData.items.map(item => (
                <Menu.Item
                  key={item.link}
                  className={classNames({
                    link: true,
                  })}
                >
                  <Link to={item.link}>{item.title}</Link>
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
