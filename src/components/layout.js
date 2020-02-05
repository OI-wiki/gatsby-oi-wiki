/** @jsx jsx */
import { Global } from "@emotion/core";
import { jsx } from "theme-ui";
import theme from '../theme'
//Components
import myFooter from "./Footer";
import Navbar from "./Navbar";
import AuthorsArray from "./AuthorsArray";
import Tags from "./Tags";
import Toc from "./Toc";
import Link from "./Link";
import { Button, Layout, Menu, Breadcrumb, Icon, Card } from "antd";
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
  return (
      <Layout style={{ minHeight: "100vh" }}>
        {/* <Global /> */}
        <Header 
            sx={{
                position: 'fixed',
                zIndex: '20',
                width: '100%'
            }}
        >
          <Navbar />
        </Header>
        <Layout>

            <SideBar 
              style={{ background: '#fff' }} 
              sx={theme.layout.sidebar}
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
                <Breadcrumb>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                  <Card title={title}>{children}</Card>
              </Content>
              <AuthorsArray authors={authors} />
              <Tags tags={tags} />
            </Layout>
  
            <Toc toc={toc} sx={theme.layout.toc} />

        </Layout>
        <Footer style={{ textAlign: "center" }}>
            {/* <myFooter /> */}
        </Footer>
      </Layout>
  );
}

export default myLayout;
