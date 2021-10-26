import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../src/constants";
import { DBManager } from "../../../src/DBManager";
import { DBObject, DBObjectAttr } from "../../../src/types";
import ErrorDialog from "../ErrorDialog";
import DetailFrame from "./DetailFrame";

const DetailFrameContainer: FC<{ DBObjectClass: string, DBObject: DBObject, mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, setDBObject: Function, setErrorMsg: Function, updateDBObject: Function }> = (props) => {
    let formDefinition = DBManager.getFormDefinition(props.DBObjectClass);

    const formSubmitted = async (event) => {
        event.preventDefault();
        console.log('props.DBObject: ', props.DBObject);
        let conditionError = "";
        formDefinition.detailFrame.components.forEach((component, index, array) => {
            if (component.constraints) {
                console.log('item.constraints: ', component.constraints);
                component.constraints.forEach((constraint, index, array) => {
                    let subtituted = constraint.condition.replaceAll("$", "props.DBObject.editedAttrs[props.DBObject.editedAttrs.findIndex(attr=>attr.key=='" + component.attributeKey + "')].value");
                    console.log('subtituted: ', subtituted);
                    if (!eval(subtituted)) {
                        conditionError = constraint.errMsgIfFail;
                    }
                })
            }
        })

        if (conditionError) {
            props.setErrorMsg(conditionError);
            return;
        }
        let body: any = { className: props.DBObjectClass, attributes: {}};
        props.DBObject.editedAttrs.forEach((attr, index, array) => {
            body.attributes[attr.key] = attr.value;
        })
        if(props.mode == DetailFrameMode.NEW_ENTRY){ // set default values for selectboxes...
            formDefinition.detailFrame.components.forEach(component =>{
                if(component.componentType == ComponentType.SELECTBOX && body.attributes[component.attributeKey] == undefined){
                    body.attributes[component.attributeKey] = component.values[0]; // set only body, not DBObject.editedAttrs!
                }
            })    
        }

        let resultErr = "";
        if(props.mode == DetailFrameMode.EDITING_ENTRY){
            body["updateId"] = props.DBObject.id;
            body["primaryKey"] = props.DBObject.attributes[0].key;;
            resultErr = await DBManager.updateInDB(body);
        }else {
            resultErr = await DBManager.insertToDB(body);
        }

        if (resultErr && typeof resultErr == "string" && resultErr.length) {
            if(resultErr.includes("UNIQUE constraint failed")){
                props.setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
            }else{
                props.setErrorMsg(resultErr);
            }
        }
    };

    const updateDBObject = (attrKey, e) => {
        props.setDBObject(prevState => {
            //let editedAttrs = [...prevState.editedAttrs, {key: attrKey, value: e.target.value} as DBObjectAttr]
            let editedAttrs: Array<DBObjectAttr> = prevState.editedAttrs || [];
            if (editedAttrs.filter(editedAttr => { return editedAttr.key == attrKey }).length) { // Klíč je již přítomný
                editedAttrs[editedAttrs.findIndex(editedAttr => editedAttr.key == attrKey)].value = e.target.value;
            } else {
                editedAttrs.push({ key: attrKey, value: e.target.value } as DBObjectAttr);
            }
            return { ...prevState, isEdited: true, };
        })
    }

    /*useEffect(() => {
        props.headerItems.map(((item, i) => {            
            if (item.type == ComponentType.SELECTBOX) {
                if(!props.DBObject.edited[item.objectParamName]){
                    updateDBObject(item.objectParamName, {target:{value: item.values[0]}});
                }
            }
        }))
        return () => {
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headerItems])*/

    return (
        <DetailFrame DBObjectClass={props.DBObjectClass} DBObject={props.DBObject} definition={formDefinition} mode={props.mode} hideDetailFrame={props.hideDetailFrame} formSubmitted={formSubmitted} setErrorMsg={props.setErrorMsg} updateDBObject={updateDBObject} />
    )
}

export default DetailFrameContainer;