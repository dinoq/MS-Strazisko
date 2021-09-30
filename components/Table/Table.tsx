import React, { useState } from "react";

const AppTable = (props) => {
    console.log("ASDF", props.headerItems);
  return (
    <>asd
    <table className={""}>
      <thead>
        <tr className={""}>
            {props.headerItems.map((item, index, array) => {
                return <th key={"thtrtd-"+index} className={""}>{item.title}</th>
            })}
        </tr>
      </thead>
      <tbody>
            {props.bodyRows.map((row, index, array) => {
                return <tr key={"tbtr-"+index} className={row.classes}>{row.items.map((item, index, array) => {
                    return <td key={"tbtrtd-"+index} className={""}>{item.title}</td>
                })}
                </tr>
            })}
      </tbody>
    </table>
    </>
  );
};

export default AppTable;