import React, { FC, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../src/constants";
import { DBManager } from "../../../src/DBManager";
import { DBObject, DetailFrameDef, FormDef } from "../../../src/types";
import ErrorDialog from "../ErrorDialog";

const DetailFrame: FC<{ DBObjectClass: string, DBObject: DBObject, definition: FormDef, mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, formSubmitted: FormEventHandler<HTMLFormElement>, setErrorMsg: Function, updateDBObject: Function }> = (props) => {
    return (
        <div>
            <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={props.formSubmitted}>
                {props.definition.detailFrame.components.map(((item, i) => {
                    if (item.componentType == ComponentType.INPUT) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center">
                                    <input type={item.inputType ? item.inputType : "text"} placeholder={props.DBObject.attributes[item.attributeKey]} value={DBManager.getAttrFromArrByKey(props.DBObject.editedAttrs, item.attributeKey)?.value || ""} onChange={props.updateDBObject.bind(this, item.attributeKey)} required />
                                </div>
                            </div>
                        );
                    } else if (item.componentType == ComponentType.SELECTBOX) {
                        if (props.mode == DetailFrameMode.EDITING_ENTRY) {
                            console.log("D", item.editable, !item.editable);
                            return (
                                <select key={"selectbox-" + i} value={DBManager.getAttrFromArrByKey(props.DBObject.editedAttrs, item.attributeKey)?.value || ""} onChange={props.updateDBObject.bind(this, item.attributeKey)} disabled={!item.editable}>
                                    {item.values.map((val, j) => {
                                        return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                    })}
                                </select>
                            );
                        } else {
                            return (
                                <select key={"selectbox-" + i} value={(props.DBObject.editedAttrs[item.attributeKey]) ? props.DBObject.editedAttrs[item.attributeKey] : props.DBObject.attributes[item.attributeKey]} onChange={props.updateDBObject.bind(this, item.attributeKey)}>
                                    {item.values.map((val, j) => {
                                        return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                    })}
                                </select>
                            );
                        }
                    } else {
                        return (
                            <div key={"component-" + i}>

                            </div>
                        );
                    }
                }))}

                <div className="d-flex justify-content-center">
                    <input className="button" type="submit" value="Uložit" />
                    <input className="button button-danger" onClick={props.hideDetailFrame} type="button" value="Zrušit" />
                </div>
            </form>
        </div>
    )
}
//"řetězec".normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-").toLowerCase() diakritika...

export default DetailFrame;