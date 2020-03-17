/** @jsx jsx */
import { jsx } from "theme-ui"
import theme from "../theme"
//Components
import Navbar from "./Navbar"
import Toc from "./Toc"
import Meta from "./Meta"
import useWindowSize from "./WindowSize"
import { Layout, Card, BackTop, Row, Col } from "antd"
import SideBar from "./Sidebar"
import { Helmet } from "react-helmet"
import "antd/dist/antd.css"
import { useState } from "react"

const { Header, Content, Footer, Sider } = Layout

function myLayout({
  children,
  location,
  authors,
  title,
  description,
  tags,
  toc,
  relativePath,
  modifiedTime,
}) {
  let [collapsed, setCollapsed] = useState(window.innerWidth < 1200)
  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      {/* <Global /> */}
      <Helmet>
        <title>{title === "OI Wiki" ? title : `${title} - OI Wiki`}</title>
      </Helmet>
      <Header
        sx={{
          position: "fixed",
          zIndex: "20",
          width: "100%",
          height: 48,
          lineHeight: "48px",
          background: "#fff",
          padding: "0px",
        }}
      >
        <Navbar toggleSider={() => setCollapsed(!collapsed)} />
      </Header>
      <Layout style={{ background: "#fff" }} sx={theme.layout.www}>
        <SideBar
          style={{ background: "#fff" }}
          sx={theme.layout.sidebar}
          pathname={location.pathname}
          breakpoint="xl"
          onBreakpoint={broken =>
            broken ? setCollapsed(true) : setCollapsed(false)
          }
          collapsed={collapsed}
          trigger={null}
        />

        <Layout sx={theme.layout.main}>
          <Content
            style={{
              background: "#fff",
              margin: 0,
              minHeight: 280,
            }}
          >
            <Card
              title={title}
              headStyle={{ fontSize: "2.5rem" }}
              bodyStyle={{ fontSize: "16px" }}
              sx={{
                padding: "0 24px",
                p: {
                  lineHeight: "2rem",
                },
                ol: {
                  lineHeight: "2rem",
                },
                ul: {
                  lineHeight: "2rem",
                },
                color: "#304455",
              }}
              bordered={false}
            >
              {children}
            </Card>
            <Meta
              authors={authors}
              tags={tags}
              relativePath={relativePath}
              modifiedTime={modifiedTime}
            ></Meta>
            <BackTop></BackTop>
          </Content>
        </Layout>

        <Toc toc={toc} sx={theme.layout.toc} key={location.key} />
      </Layout>
      <Footer sx={theme.layout.footer} className="oiFooter">
        <Row
          sx={{
            display: "block",
          }}
        >
          <Col span={8}>
            <div className="footer-right">
              Copyright © 2016 - 2020 OI Wiki Team
            </div>
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default myLayout
