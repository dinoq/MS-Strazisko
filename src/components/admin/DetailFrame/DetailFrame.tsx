import React, { createRef, FC, FormEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../helpers/constants";
import { DBManager } from "../../../helpers/DBManager";
import { DBObject, DetailFrameDef, FormDef } from "../../../helpers/types";
import ErrorDialog from "../ErrorDialog";
import FileChooser from "../formComponents/FileChooser/FileChooser";
import FileChooserContainer from "../formComponents/FileChooser/FileChooserContainer";

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
            <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={props.formSubmitted} encType="multipart/form-data">
                {props.definition.detailFrame.components.map(((component, i) => {
                    let disabled = false;
                    let value = DBManager.getAttrFromArrByKey(props.DBObject.editedAttrs, component.attributeKey)?.value || "";
                    if (props.mode == DetailFrameMode.EDITING_ENTRY) {
                        disabled = i == 0;//!component.editable;
                    }

                    if (component.componentType == ComponentType.TextField || component.componentType == ComponentType.DateField) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center">
                                    {getInput(component.componentType, {
                                        id: component.attributeKey,
                                        placeholder: component.componentName,
                                        value,
                                        onChange: (e) => props.updateDBObject(component.attributeKey, e.target.value),
                                        required: component.required,
                                        disabled
                                    })}
                                </div>
                            </div>
                        );
                    } else if (component.componentType == ComponentType.SelectBox) {
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center position-relative">
                                    <select key={"selectbox-" + i} id={component.attributeKey} value={value} onChange={(e) => props.updateDBObject(component.attributeKey, e.target.value)} disabled={disabled}>
                                        {component.values.map((val, j) => {
                                            return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                        })}
                                    </select>
                                    <label className="label" htmlFor={component.attributeKey}>{component.componentName}</label>
                                </div>
                            </div>
                        );
                    } else if (component.componentType == ComponentType.FileChooser) {
                        return (
                            <FileChooserContainer key={"input-" + i} id={component.attributeKey} onChange={props.updateDBObject} initLabel={component.componentName} />
                        )
                    } else if (component.componentType == ComponentType.RichTextField) {
                        const inputRef = createRef<HTMLTextAreaElement>();

                        const substituteTags = (text, toRegular)=>{
                            if(toRegular){
                                text = text.replaceAll("<TUCNE>", "<b>");
                                text = text.replaceAll("</TUCNE>", "</b>");
                                text = text.replaceAll("<CERVENE>", '<span style="color: red">');
                                text = text.replaceAll("</CERVENE>", '</span>');
                            }else{
                                text = text.replaceAll("<b>", "<TUCNE>");
                                text = text.replaceAll("</b>", "</TUCNE>");
                                text = text.replaceAll('<span style="color: red">', "<CERVENE>");
                                text = text.replaceAll('</span>', "</CERVENE>");
                            }
                            return text;
                        }
                        const insertTags = (tag) => {
                            const opening = `<${tag}>`;
                            const closing = `</${tag}>`;
                            const cursorPosStart = inputRef?.current.selectionStart;
                            const cursorPosEnd = inputRef?.current.selectionEnd;
                            const selectionLength = cursorPosEnd - cursorPosStart;
                            const inputText = inputRef?.current.value;
                            const textBefCursor = inputText.substring(0, cursorPosStart);
                            const textBetweenCursor = inputText.substring(cursorPosStart, cursorPosEnd);
                            const textAfCursor = inputText.substring(cursorPosEnd, inputText.length);
                            const result = `${textBefCursor}${opening}${textBetweenCursor}${closing}${textAfCursor}`;
                            inputRef.current.value = result;
                            inputRef?.current.focus();
                            inputRef.current.selectionStart = cursorPosStart + opening.length;
                            inputRef.current.selectionEnd = cursorPosStart + opening.length + selectionLength;
                            props.updateDBObject(component.attributeKey, substituteTags(inputRef.current.value, true) );
                        }

                        
                        return (
                            <div key={"input-" + i}>
                                <div className="d-flex justify-content-center">

                                    <div className="richtextEditContainer">
                                        <textarea cols={45} rows={5} ref={inputRef} id={component.attributeKey} placeholder={component.componentName} onChange={(e) => props.updateDBObject(component.attributeKey, e.target.value)} required={component.required} disabled={disabled} value={substituteTags(value, false)} />
                                        <label className="label" htmlFor={component.attributeKey}>{component.componentName}</label>
                                        <div className="richtextEditBtns">
                                            <a type="button" className="richtextEdit button" onClick={(e) => { insertTags("TUCNE") }}><b>tučně</b></a>
                                            <a type="button" className="richtextEdit button" onClick={(e) => { insertTags("CERVENE") }}><span style={{color: "red"}}>červeně</span></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
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