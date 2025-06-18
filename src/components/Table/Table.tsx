// TODO is needed?
import React, { FC, useState } from "react";

type AppTableProps = {
    headerItems: Array<any>, 
    bodyRows: Array<any>
}

const AppTable: FC<AppTableProps> = ({
    headerItems, 
    bodyRows
}) => {
  let rows = (bodyRows)? bodyRows : [];
  //return (<div></div>)
  return (
    <>
    <table className={""}>
      <thead>
        <tr className={""}>
            {headerItems.map((item, index, array) => {
                return <th key={"thtrtd-"+index} className={""}>{item.content}</th>
            })}
        </tr>
      </thead>
      <tbody>
            {rows.map((row, index, array) => {
                return <tr key={"tbtr-"+index} className={row.selected? "selected-row" : ""}>{row.items.map((item, index, array) => {
                    return <td colSpan={item.colspan? item.colspan : 1} key={"tbtrtd-"+index} className={item.className? item.className : ""}>{item.content}</td>
                })}
                </tr>
            })}
            {(!rows || !rows.length) &&
            <tr>
              <td colSpan={headerItems.length} className="text-center">Nenalezena žádná data!</td>
            </tr>            
            }
      </tbody>
    </table>
    </>
  );
};

export default AppTable;