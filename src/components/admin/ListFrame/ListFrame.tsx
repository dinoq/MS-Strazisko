// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useEffect, useState } from "react";
import { ComponentType } from "../../../constants";
import { DBManager } from "../../../DBManager";
import { DBObject, LFComponentDef, ListFrameDef } from "../../../types";

const ListFrame: FC<{ definition: ListFrameDef, DBOClass: string, DBObject: DBObject, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function, entries: Array<DBObject>, colspanNoData: number }> = (props) => {

    return (
        <>
            <table className={""}>
                <thead>
                    <tr className={""}>
                        {props.definition?.detailDBOClass.length > 0 && <th className={""}>Detail</th>}
                        {props.definition?.components.map((item, index, array) => {
                            return <th key={"thtrtd-" + index} className={""}>{item.componentName}</th>
                        })}
                        {props.definition?.actions && <th className={""}>Akce</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.entries.map((entry, index, array) => {
                        return <tr key={"tbtr-" + index} className={(props.DBObject.id == entry.id) ? "selected-row" : ""}>
                            {props.definition?.detailDBOClass.length > 0 &&
                                <td className={""}>
                                    <span className="link" onClick={props.detailClickedHandler.bind(this, entry)}>Detail</span>
                                </td>}
                            {
                                props.definition?.components.map((component: LFComponentDef, index, array) => {
                                    let getAttrVal = (key) => {
                                        return DBManager.getAttrFromArrByKey(entry.attributes, key).value
                                    };

                                    let value = "";
                                    if(component.componentType == ComponentType.TextField){
                                        let command = component.transformation.replaceAll(/@\[(.*)\]/g, "getAttrVal('$1')"); // remove @[attrKey] (=> val of attr of attrKey)
                                        value = eval(command);

                                    }
                                    /*let attr = DBManager.getAttrFromArrByKey(entry.attributes, component.attributeKey); // get object attr
                                    let defAttr = DBManager.getLFComponentFromArrByKey(props.definition.components, component.attributeKey); // get def attr*/
                                    if (component.transformation && false) {
                                        //let command = component.transformation.replaceAll("$", attr.value); // remove $ (=> attr Val)

                                        let command = component.transformation.replaceAll(/@\[(.*)\]/g, "getAttrVal('$1')"); // remove @[attrKey] (=> val of attr of attrKey)
                                        console.log('command: ', command);
                                        //value = eval("const date = new Date(getAttrVal('date'));date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear()");
                                        value = eval(command);
                                        console.log('value: ', value);
                                        value = value.toString();
                                    }
                                    return <td key={"tbtrtd-" + index}>{value}</td>;
                                })}
                            {props.definition?.actions && <td className={"actions"}>
                                {props.definition?.actions.delete && <span className={"link link-danger"} onClick={props.deleteItemHandler.bind(this, entry)}>Smazat</span>}
                                {props.definition?.actions.edit && <span className={"link"} onClick={props.editItemHandler.bind(this, entry)}>Editovat</span>}
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