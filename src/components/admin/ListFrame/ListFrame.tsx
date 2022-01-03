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
                                        if(entry.attributes.findIndex((attr)=>{return attr.key == key}) > -1){ // Key is in attributes
                                            return DBManager.getAttrFromArrByKey(entry.attributes, key).value
                                        }else if(entry.persistentAttributes.findIndex((attr)=>{return attr.key == key}) > -1){ // Key is in persistent attributes
                                            return DBManager.getAttrFromArrByKey(entry.persistentAttributes, key).value
                                        }else{// else error?
                                            
                                        }
                                    };

                                    let value: any = "";

                                    let tr = component.transformation;
                                    var count = (tr.match(/@\[(.*?)\]/g) || []).length;
                                    let trSplitted = tr.split(/@\[(.*?)\]/g);
                                    let evaluated = "";
                                    for(let i = 0;i<trSplitted.length;i++){
                                        //i = tr.indexOf(,i);
                                        if(i%2 == 1){
                                            evaluated = evaluated.concat(getAttrVal(trSplitted[i]));// remove @[attrKey] (=> val of attr of attrKey)
                                        }else{
                                            evaluated = evaluated.concat(trSplitted[i]);
                                        }
                                    }

                                    //console.log("evaluated",evaluated, eval(evaluated));
                                    if(component.componentType == ComponentType.TextField){
                                        value = evaluated;

                                    }else if(component.componentType == ComponentType.ImagePreview){
                                        value = (
                                            <img src={"../img/albums/"+evaluated} className="ImagePreview"/>
                                        )
                                    }else if(component.componentType == ComponentType.DateField){
                                        let date = new Date(evaluated);
                                        value = date.getDate() + ". " + (date.getMonth()+1) + ". " + date.getFullYear();
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