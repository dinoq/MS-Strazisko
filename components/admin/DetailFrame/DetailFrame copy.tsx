import React, { FC, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../constants/constants";
import { DBObject, DetailFrameDef } from "../../../constants/types";
import ErrorDialog from "../ErrorDialog";

const DetailFrame: FC<{definition: DetailFrameDef, DBObjectClass: string, DBObject: DBObject, setDBObject: Function, url: string, setErrorMsg: Function, mode:DetailFrameMode, hideObjectManager: MouseEventHandler<HTMLInputElement>, formSubmitted: FormEventHandler<HTMLFormElement>}>= (props) => {
    return (
        <div>
            <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={props.formSubmitted}>
                {props.definition.components.map(((item, i) => {
                    if (item.editable) {
                        if (item.type == ComponentType.INPUT) {
                            return (
                                <div key={"input-" + i}>
                                    <div className="d-flex justify-content-center">
                                        <input type={item.inputType ? item.inputType : "text"} id={item.id ? item.id : ""} placeholder={item.content} value={(props.DBObject.editedAttrs[item.objectParamName])?props.DBObject.editedAttrs[item.objectParamName]:props.DBObject.attributes[item.objectParamName]} onChange={updateDBObject.bind(this, item.objectParamName)} required/>
                                    </div>
                                </div>
                            );
                        } else if (item.type == ComponentType.SELECTBOX) {
                            if (props.mode == DetailFrameMode.EDITING_ENTRY) {
                                return (
                                    <select key={"selectbox-" + i} id={item.id ? item.id : ""} value={(props.DBObject.editedAttrs[item.objectParamName])?props.DBObject.editedAttrs[item.objectParamName]:props.DBObject.attributes[item.objectParamName]} onChange={updateDBObject.bind(this, item.objectParamName)} disabled={!item.editableInEditMode}>
                                        {item.values.map((val, j) => {
                                            return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                        })}
                                    </select>
                                );
                            } else {
                                return (
                                    <select key={"selectbox-" + i} id={item.id ? item.id : ""} value={(props.DBObject.editedAttrs[item.objectParamName])?props.DBObject.editedAttrs[item.objectParamName]:props.DBObject.attributes[item.objectParamName]} onChange={updateDBObject.bind(this, item.objectParamName)}>
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
                    }
                }))}

                <div className="d-flex justify-content-center">
                    <input className="button" type="submit" value="Uložit" />
                    <input className="button button-danger" onClick={props.hideObjectManager} type="button" value="Zrušit" />
                </div>
            </form>
        </div>
    )
}
//"řetězec".normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-").toLowerCase() diakritika...

export default DetailFrame;