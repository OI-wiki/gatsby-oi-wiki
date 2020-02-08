/** @jsx jsx */
import { Global } from "@emotion/core";
import { jsx } from "theme-ui";
import theme from '../theme'
//Components
import { MDXProvider } from '@mdx-js/react'
import FooterMDX from '../footer.mdx'
import Navbar from "./Navbar";
import AuthorsArray from "./AuthorsArray";
import Tags from "./Tags";
import Toc from "./Toc";
import Link from "./Link";
import { Layout, Card, BackTop } from "antd";
import SideBar from "./Sidebar";
import "antd/dist/antd.css";

const { Header, Content, Footer, Sider } = Layout;

function myLayout({
  children,
  location,
  authors,
  title,
  description,
  tags,
  toc
}) {
  console.log('location',location);
  return (
      <Layout style={{ minHeight: "100vh",background: '#fff' }}>
        {/* <Global /> */}
        <Header 
          sx={{
              position: 'fixed',
              zIndex: '20',
              width: '100%',
              height: 48,
              lineHeight: '48px'
          }}
        >
          <Navbar />
        </Header>
        <Layout style={{ background: '#fff' }} >

            <SideBar 
              style={{ background: '#fff' }} 
              sx={theme.layout.sidebar}
              pathname={location.pathname}
            />
  
            <Layout 
              //style={{ padding: '0 24px 24px' }} 
              sx={theme.layout.main}
            >
              <Content style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}>
                  <Card>{children}</Card>
              <AuthorsArray authors={authors} />
              <Tags tags={tags} />
              <BackTop />
              </Content>
            </Layout>
  
            <Toc toc={toc} sx={theme.layout.toc} />

        </Layout>
        <Footer style={{ textAlign: "center" }} sx={theme.layout.footer}>
          <MDXProvider>
            <FooterMDX />
          </MDXProvider>
        </Footer>
      </Layout>
  );
}

export default myLayout;
