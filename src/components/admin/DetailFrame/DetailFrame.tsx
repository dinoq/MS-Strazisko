import React, { FC, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../constants";
import { DBManager } from "../../../DBManager";
import { DBObject, DetailFrameDef, FormDef } from "../../../types";
import ErrorDialog from "../ErrorDialog";
import FileChooser from "../formComponents/FileChooser/FileChooser";

const DetailFrame: FC<{ DBOClass: string, DBObject: DBObject, definition: FormDef, mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, formSubmitted: FormEventHandler<HTMLFormElement>, setErrorMsg: Function, updateDBObject: Function }> = (props) => {
    const getInput = (componentType: ComponentType, attrs) => {
        switch (componentType) {
            case ComponentType.DateField:
                return (
                    <div className="position-relative">
                        <input type="date" {...attrs} />
                        <label className="label" htmlFor={attrs.id}>{attrs.placeholder}</label>
                    </div>
                );
            case ComponentType.TextField:
            default:
                return (
                    <div className="position-relative">
                        <input type="text" {...attrs} />
                        <label className="label" htmlFor={attrs.id}>{attrs.placeholder}</label>
                    </div>
                );
        }
    }
    
    return (
        <div>
            <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={props.formSubmitted}>
                {props.definition.detailFrame.components.map(((component, i) => {
                    let disabled = false;
                    let value = DBManager.getAttrFromArrByKey(props.DBObject.editedAttrs, component.attributeKey)?.value || "";
                    if (props.mode == DetailFrameMode.EDITING_ENTRY) {
                        disabled = !component.editable;
                    }

                    if (component.componentType == ComponentType.TextField || component.componentType == ComponentType.DateField) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center">
                                    {getInput(component.componentType, {
                                        id: component.attributeKey,
                                        placeholder: component.componentName,
                                        value,
                                        onChange: props.updateDBObject.bind(this, component.attributeKey),
                                        required: true,
                                        disabled
                                    })}
                                </div>
                            </div>
                        );
                    } else if (component.componentType == ComponentType.SelectBox) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center position-relative">
                                    <select key={"selectbox-" + i} id={component.attributeKey} value={value} onChange={props.updateDBObject.bind(this, component.attributeKey)} disabled={disabled}>
                                        {component.values.map((val, j) => {
                                            return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                        })}
                                    </select>
                                    <label className="label" htmlFor={component.attributeKey}>{component.componentName}</label>
                                </div>
                            </div>
                        );
                    }  else if(component.componentType == ComponentType.FileChooser){
                        return (
                            <FileChooser id={component.attributeKey}/>
                        )
                    } else {
                        throw new Error(`Neznámý typ komponenty (${component.componentType}) v DetailFramu!`);
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