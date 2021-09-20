import React, { useState } from "react";
/* 
const columns = [
  {
    title: "Název",
    dataIndex: "name",
  },
  {
    title: "URL",
    dataIndex: "url",
    sorter: (a: any, b: any) => a.url - b.url,
  },
  {
    title: "Akce",
    key: "action",
    sorter: true,
    // eslint-disable-next-line react/display-name
    render: () => (
      <Space size="middle">
        <a>
          <Text type="danger">Smazat</Text>
        </a>
        <a>
          <Text type="success">Editovat</Text>
        </a>
      </Space>
    ),
  },
]; */

const data: any = [];
for (let i = 1; i <= 3; i++) {
  data.push({
    key: i,
    name: "John Brown",
    url: `/${i}2`,
    address: `New York No. ${i} Lake Park`,
    description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  });
}

const AppTable = () => {
 /*  const tableColumns = columns.map((item) => ({
    ...item,
  })); */

  return (
    <>
    </>
  );
};

export default AppTable;


/**
 * 
 * 
      <Table
        {...{
          bordered: true,
          loading: false,
          size: "middle",
          title: undefined,
          rowSelection: {},
          scroll: undefined,
          top: "none",
          bottom: "bottomRight",
        }}
        pagination={{ position: ["bottomCenter"] }}
        columns={tableColumns}
        dataSource={data}
      />
 */