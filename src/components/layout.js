/** @jsx jsx */
import { Global } from "@emotion/core";
import { jsx } from "theme-ui";
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
      <Header>
        <Navbar />
      </Header>
      <Layout>
          <SideBar width={200} style={{ background: '#fff' }} />
          <Layout style={{ padding: '0 24px 24px' }}>

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
          </Layout>

          <AuthorsArray authors={authors} />

          <Tags tags={tags} />

          <Toc toc={toc} />
          </Layout>
          <Footer style={{ textAlign: "center" }}>{/* <myFooter /> */}</Footer>
    </Layout>
  );
}

export default myLayout;
