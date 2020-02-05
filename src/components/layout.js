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
      <Global />
      <Header>
        <Navbar />
      </Header>
      <Layout>
        <Layout>
          <SideBar />

          <Content>
            <Breadcrumb>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div>
              <Card title={title}>{children}</Card>
            </div>
          </Content>

          <AuthorsArray authors={authors} />

          <Tags tags={tags} />

          <Toc toc={toc} />
          <Footer style={{ textAlign: "center" }}>{/* <myFooter /> */}</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default myLayout;
