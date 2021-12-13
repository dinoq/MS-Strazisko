import React, { FC, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../constants";
import { DBManager } from "../../../DBManager";
import { DBObject, DetailFrameDef, FormDef } from "../../../types";
import ErrorDialog from "../ErrorDialog";

const DetailFrame: FC<{ DBOClass: string, DBObject: DBObject, definition: FormDef, mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, formSubmitted: FormEventHandler<HTMLFormElement>, setErrorMsg: Function, updateDBObject: Function }> = (props) => {
    const getInput = (componentType: ComponentType, attrs) => {
        switch (componentType) {
            case ComponentType.DateField:
                return (
                    <div className="position-relative">
                        <input type="date" {...attrs} />
                        <label htmlFor={attrs.id}>{attrs.placeholder}</label>
                    </div>
                );
            case ComponentType.TextField:
            default:
                return (
                    <div className="position-relative">
                        <input type="text" {...attrs} />
                        <label htmlFor={attrs.id}>{attrs.placeholder}</label>
                    </div>
                );
        }

    }
    console.log('props.definition.detailFrame.components: ', props.definition.detailFrame.components);
    return (
        <div>
            <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={props.formSubmitted}>
                {props.definition.detailFrame.components.map(((item, i) => {
                    let disabled = false;
                    let value = DBManager.getAttrFromArrByKey(props.DBObject.editedAttrs, item.attributeKey)?.value || "";
                    if (props.mode == DetailFrameMode.EDITING_ENTRY) {
                        disabled = !item.editable;
                    }

                    if (item.componentType == ComponentType.TextField || item.componentType == ComponentType.DateField) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center">
                                    {/* <input type={item.inputType ? item.inputType : "text"} placeholder={props.DBObject.attributes[item.attributeKey]} value={value} onChange={props.updateDBObject.bind(this, item.attributeKey)} required  disabled={disabled}/> */}

                                    {getInput(item.componentType, {
                                        id: item.attributeKey,
                                        placeholder: DBManager.getAttrFromArrByKey(props.DBObject.attributes, item.attributeKey).name,
                                        value,
                                        onChange: props.updateDBObject.bind(this, item.attributeKey),
                                        required: true,
                                        disabled
                                    })}
                                </div>
                            </div>
                        );
                    } else if (item.componentType == ComponentType.SelectBox) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center position-relative">
                                    <select key={"selectbox-" + i} id={item.attributeKey} value={value} onChange={props.updateDBObject.bind(this, item.attributeKey)} disabled={disabled}>
                                        {item.values.map((val, j) => {
                                            return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                        })}
                                    </select>
                                    <label htmlFor={item.attributeKey}>{DBManager.getAttrFromArrByKey(props.DBObject.attributes, item.attributeKey).name}</label>
                                </div>
                            </div>
                        );
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