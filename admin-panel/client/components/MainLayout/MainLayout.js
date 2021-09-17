import { Layout, Menu, Breadcrumb, Image, Switch, Grid, Col, Row } from "antd";
import {
  HomeOutlined,
  DatabaseOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
//import Appanel from '../projects/Appanel/Appanel';
import MenuItem from "antd/lib/menu/MenuItem";
import Link from "next/link";
import "antd/dist/antd.dark.css";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    console.log("collapsed: ", collapsed);
    setCollapsed((collapsedPrev) => !collapsedPrev);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link href="/">Domů</Link>
          </Menu.Item>
          <Menu.Item key="pages" icon={<DatabaseOutlined />}>
            <Link href="/pages">Stránky</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link href="/users">Uživatelé</Link>
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            <Link href="/settings">Nastavení</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: "5px 20px" }}
        >
          <Row justify="end" className="main-layout__header">
            <Col>Jméno Přijmení</Col>
          </Row>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Administrace 1.0 ©{new Date().getFullYear()} Created by{" "}
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Petr Marek
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
