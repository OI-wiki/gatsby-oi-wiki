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

const { Header, Content, Footer } = Layout

const LazySider = Loadable({
  loader: () => import("./Sidebar"),
  loading: () => <div />,
})

const LazyComment = Loadable({
  loader: () => import("./Comment"),
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
  noMeta,
  noComment,
}) {
  const isSSR = typeof window === "undefined"
  const isSmallScreen = !isSSR && window.innerWidth < 1200
  let [collapsed, setCollapsed] = useState(isSmallScreen)
  const clickLayer = (
    <div
      sx={{
        position: "fixed",
        zIndex: 2,
        height: "100%",
        width: "100%",
        background: "rgba(0, 0, 0, .60)",
        display: ["block", null, null, "none"],
      }}
      onClick={() => setCollapsed(true)}
    />
  )
  const pageTitle = title === "OI Wiki" ? title : `${title} - OI Wiki`
  return (
    <Layout>
      {!collapsed && isSmallScreen && clickLayer}
      {/* if sider is open, and we are on small screen, show this layer */}
      <Helmet>
        <title>{title}</title>
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
      <Layout sx={theme.layout.www}>
        <LazySider
          sx={theme.layout.sidebar}
          pathname={location.pathname}
          breakpoint="xl"
          onBreakpoint={(broken) =>
            broken ? setCollapsed(true) : setCollapsed(false)
          }
          collapsed={collapsed}
          trigger={null}
        />

        <Layout sx={theme.layout.main}>
          <Content>
            <Card
              title={pageTitle}
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
              noMeta={noMeta}
            ></Meta>
            <div sx={theme.layout.comment}>
              <LazyComment title={title} noComment={noComment}></LazyComment>
            </div>
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
