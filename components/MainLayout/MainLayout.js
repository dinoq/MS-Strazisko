
import React, { useState } from "react";
import Link from "next/link";
import classes from "./MainLayout.module.scss";

const MainLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    console.log("collapsed: ", collapsed);
    setCollapsed((collapsedPrev) => !collapsedPrev);
  };

  const logout = async () => {
    const result = await fetch("/api/logoutAdmin",
    {
      method: "POST",
      mode: "same-origin"
    })
    if(result.status === 200){
      window.location.replace("/admin");
    }
  }

  return (
    <div className={classes.layout + ""}>
      <div className="">
        <div className={classes.header + ""}>
          <div className={classes.leftSide}>
          </div>
          <div className={classes.rightSide}>
            <span className={classes.span}>Admin</span>
            <span className={classes.span} onClick={logout}>Odhlásit se</span>
          </div>
        </div>
      </div>
      <div className={classes.main}>

        <div className={classes.sider + " "}>
          f
        </div>
        <div className={classes.content + " "}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;


/**
 *
 *
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["0"]} mode="inline">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link href="/admin">Domů</Link>
          </Menu.Item>
          <Menu.Item key="pages" icon={<DatabaseOutlined />}>
            <Link href="/admin/pages">Stránky</Link>
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
 */