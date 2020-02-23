/** @jsx jsx */
import React from 'react';
import { jsx } from "theme-ui"
import navbarData from "../navbar.yaml"
import navbarSubData from "../navbarSub.yaml"
// import ColorModeButton from './ColorModeButton'
import Link from "./Link"
import { MdSchool } from "react-icons/md"
import Search from "antd/lib/input/Search"
import theme from "../theme"
import classNames from 'classNames'
import {Menu,Icon} from 'antd'

const {SubMenu} = Menu;




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
  render(){
  return (

    <nav
      aria-label="Navbar Menu"
      sx={{
        "box-shadow":
          "0 0 0.2rem rgba(0,0,0,.1), 0 0.2rem 0.4rem rgba(0,0,0,.2)",
        width: "100%",
        padding: "0 8%"
      }}
    >
      <div
        sx={{
          color: "black",
        }}
        className="nav-firstrow"
      >
        <ul sx={theme.layout.navbar.navList}>
          <Link
             href='https://oi-wiki.org/'
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
          <Link href='https://oi-wiki.org/'
          sx={{
            color: "text",
            ":hover":{
              color :"#1E90FF",
              textDecoration: "none"
            }
          }}
          >OI WiKi</Link>
          <Menu sx={{ float: "right" }}  className="layui-nav" onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
            <Search
              placeholder="键入进行搜索"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
             
      <SubMenu
          title={
            <span className="submenu-title-wrapper">
              <Icon type="edit" />
             学习文档
             <Icon type="caret-down" />
            </span>
          }
        >
      {navbarSubData.items.map(item => (
       <Menu.Item key={item.link}
         
       
       >
          <Link
                  to={item.link}
                 

                >
                  {item.title}
                </Link>

       </Menu.Item>
           

        ))} 
        </SubMenu>

            {navbarData.items.map(item => (
              <Menu.Item key={item.link} 
               className={classNames({
                  'link' : true,
                 'layui-hide-xs' : true,  
               })}
             
               
              >
                <Link
                  to={item.link}
                 

                >
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
