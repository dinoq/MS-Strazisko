// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useEffect, useState } from "react";
import { DBObject, FormDef, LFComponentDef, ListFrameDef } from "../../../constants/types";

const ListFrame: FC<{ definition: ListFrameDef, DBObjectClass: string, DBObject: DBObject, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function, entries: Array<any>, colspanNoData: number }> = (props) => {

    
    
    return (
        <>
            <table className={""}>
                <thead>
                    <tr className={""}>
                        {props.definition?.detailDBOClass && <th className={""}>Detail</th>}
                        {props.definition?.components.map((item, index, array) => {
                            return <th key={"thtrtd-" + index} className={""}>{item.attributeName}</th>
                        })}
                        {props.definition?.actions && <th className={""}>Akce</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.entries.map((entry, index, array) => {
                        return <tr key={"tbtr-" + index} className={(JSON.stringify(props.DBObject) == JSON.stringify(entry)) ? "selected-row" : ""}>
                            {props.definition?.detailDBOClass && <td className={""}><span className="link" onClick={props.detailClickedHandler.bind(this, entry)}> Detail </span></td>}
                            {
                                props.definition?.components.map((item, index, array) => {
                                    return <td key={"tbtrtd-" + index}>{entry[item.attributeKey]}</td>;
                                })}
                            {props.definition?.actions && <td className={"actions"}>
                                {props.definition?.actions.delete && <span className={"link link-danger"} onClick={props.deleteItemHandler.bind(this, entry)}>Smazat</span>}
                                {props.definition?.actions.delete && <span className={"link"} onClick={props.editItemHandler.bind(this, entry)}>Editovat</span>}
                            </td>}

                        </tr>
                    })}
                    {(props.colspanNoData != -1) &&
                        <tr>
                            <td colSpan={props.colspanNoData} className="text-center">Nenalezena žádná data!</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    )
}

export default ListFrame;