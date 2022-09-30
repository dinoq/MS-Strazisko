// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useEffect, useState } from "react";
import { ListFrameComponentType } from "../../../helpers/constants";
import { DBManager } from "../../../helpers/DBManager";
import { DBObjectType, LFComponentDef, ListFrameDef } from "../../../helpers/types";
import Image from "next/image"
import DOMPurify from "dompurify";

const ListFrame: FC<{ definition: ListFrameDef, DBObject: DBObjectType, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function, entries: Array<DBObjectType>, colspanNoData: number }> = (props) => {

    return (
        <>
            <table className={""}>
                <thead>
                    <tr className={""}>
                        {(props.definition?.detailDBOClass?.length ?? 0) > 0 && <th className={""}>Detail</th>}
                        {props.definition?.components.map((item, index, array) => {
                            return <th key={"thtrtd-" + index} className={""}>{item.componentName}</th>
                        })}
                        {props.definition?.actions && <th className={""}>Akce</th>}
                    </tr>
                </thead>
                <tbody>
                    {props.entries.map((entry, index, array) => {
                        return <tr key={"tbtr-" + index} className={(props.DBObject.id == entry.id) ? "selected-row" : ""}>
                            {(props.definition?.detailDBOClass?.length ?? 0) > 0 &&
                                <td className={""}>
                                    <span className="link" onClick={props.detailClickedHandler.bind(this, entry)}>Detail</span>
                                </td>}
                            {
                                props.definition?.components.map((component: LFComponentDef, index, array) => {

                                    let value: any = "";

                                    let evaluated = DBManager.substituteExpression(component.transformation, entry);
                                    
                                    if(component.componentType == ListFrameComponentType.TextField || component.componentType == ListFrameComponentType.RichTextField){
                                        value = evaluated;

                                    }else if(component.componentType == ListFrameComponentType.ImagePreview){
                                        console.log('component.componentType ListFrameComponentType.ImagePreview: ', component.componentType);
                                        evaluated = evaluated.startsWith("/")? evaluated : "/" + evaluated;
                                        value = (
                                            <div className="ImagePreview">
                                                <Image src={evaluated} alt="Náhled obrázku" layout="fill" objectFit="contain"/>
                                            </div>
                                        )
                                    }else if(component.componentType == ListFrameComponentType.DateField){
                                        let date = new Date(evaluated);
                                        value = date.getDate() + ". " + (date.getMonth()+1) + ". " + date.getFullYear();
                                    }
                                    if(component.componentType == ListFrameComponentType.RichTextField){
                                        value = DBManager.substituteTags(value, true);
                                        return <td key={"tbtrtd-" + index} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(value)}}></td>;
                                    }else{
                                        return <td key={"tbtrtd-" + index}>{value}</td>;
                                    }
                                })}
                            {props.definition?.actions && <td className={"actions"}>
                                {props.definition?.actions.delete && <span className={"link link-danger"} onClick={props.deleteItemHandler.bind(this, entry, false)}>Smazat</span>}
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