/** @jsx jsx */
import { jsx } from "theme-ui"
import theme from "../theme"
//Components
import Navbar from "./Navbar"
import Toc from "./Toc"
import Meta from "./Meta"
import FooterContent from "./Footer"
import Loadable from "react-loadable"
import { Layout, Card, BackTop } from "antd"
import { Helmet } from "react-helmet"
import "antd/dist/antd.css"
import { useState } from "react"

const { Header, Content, Footer, Sider } = Layout

const LazySider = Loadable({
  loader: () => import("./Sidebar"),
  loading: () => <div />,
})

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
  let [collapsed, setCollapsed] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1200 : false
  )
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
        <LazySider
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
        <FooterContent />
      </Footer>
    </Layout>
  )
}

export default myLayout
