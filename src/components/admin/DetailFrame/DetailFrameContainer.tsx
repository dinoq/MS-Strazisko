import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentType, DetailFrameMode } from "../../../helpers/constants";
import { DBManager } from "../../../helpers/DBManager";
import { editDBObjectAttr } from "../../../store/reducers/DBObjectReducer";
import { DBObject, DBObjectAttr, RootState } from "../../../helpers/types";
import ErrorDialog from "../ErrorDialog";
import DetailFrame from "./DetailFrame";

const DetailFrameContainer: FC<{ mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, setErrorMsg: Function}> = (props) => {
    const formDefinition = useSelector((state: RootState) => state.formDefinitions).actualFormDefinition;
    const breadcrumbItems = useSelector((state: RootState) => state.breadcrumb.items);
    const dispatch = useDispatch();
    let DBOClass = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition.DB.DBOClass);
    const DBObject = useSelector((state: RootState) => state.dbObject);

    const formSubmitted = async (event) => {
        event.preventDefault();
        let conditionError = "";
        formDefinition.detailFrame.components.forEach((component, index, array) => {
            if (component.constraints) {
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
        let body: any = { className: DBOClass, attributes: {}};
        DBObject.editedAttrs.forEach((attr, index, array) => {
            body.attributes[attr.key] = attr.value;
        })
        
        DBObject.persistentAttributes.forEach((attr, index, array) => {
            if(!attr.source)
                    body.attributes[attr.key] = attr.value;
        })
        console.log('props.DBObject: ', DBObject);
        if(props.mode == DetailFrameMode.NEW_ENTRY){ // set default values for selectboxes...
            formDefinition.detailFrame.components.forEach(component =>{
                if(component.componentType == ComponentType.SelectBox && body.attributes[component.attributeKey] == undefined){
                    body.attributes[component.attributeKey] = component.values[0]; // set only body, not DBObject.editedAttrs!
                }
            })    
        }

        /*
        if(breadcrumbItems.length && breadcrumbItems[breadcrumbItems.length - 1].parentAttribute){
            const parentAttribute = breadcrumbItems[breadcrumbItems.length - 1].parentAttribute;
            body.attributes[parentAttribute.key] = parentAttribute.value;
        }*/

        console.log('body.attributes: ', body.attributes);
        let resultErr = "";
        let afterSaveMethod = formDefinition.detailFrame.afterSaveMethod;
        if(props.mode == DetailFrameMode.EDITING_ENTRY){
            body["updateId"] = DBObject.id;
            body["primaryKey"] = DBObject.attributes[0].key;
            resultErr = await DBManager.updateInDB(body, !afterSaveMethod);
        }else {
            resultErr = await DBManager.insertToDB(body, (!afterSaveMethod && !DBObject.filesToUpload.length));
            if((!resultErr || !resultErr.length) && DBObject.filesToUpload.length){
                const path = DBManager.substituteExpression(formDefinition.detailFrame.components[0].componentSpecificProps.path, DBObject);
                if(DBObject.filesToUpload.length > 1){
                    throw new Error("multiple files not implemented! Bude potreba vymyslet cesty...Asi by se měly do parametru filename nějak ukládat všechny nazvy souborů...")
                }
                resultErr = await DBManager.sendFiles(DBObject.filesToUpload, path);
            }
        }

        if (resultErr && typeof resultErr == "string" && resultErr.length) {
            if(resultErr.includes("UNIQUE constraint failed")){
                props.setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
            }else{
                props.setErrorMsg(resultErr);
            }
        }else if(!resultErr){
            if(afterSaveMethod){
                let methodName = afterSaveMethod.substring(0, afterSaveMethod.indexOf("("));
                
                let rawParams = (afterSaveMethod.substring(methodName.length+1, afterSaveMethod.length-1)).split(",");
                let params = [];
                for(const rawParam of rawParams){
                    let evaluated = DBManager.substituteExpression(rawParam, DBObject);
                    params.push(evaluated);
                }
                
                console.log('params: ', params);
                resultErr = await DBManager.runServerMethod(methodName, params);
                
                if (resultErr && typeof resultErr == "string" && resultErr.length) {
                    if(resultErr.includes("UNIQUE constraint failed")){
                        props.setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
                    }else{
                        props.setErrorMsg(resultErr);
                    }
                }

            }
        }
    };

    const updateDBObject = (attrKey, value) => {
        console.log('value: ', value);
        console.log('attrKey: ', attrKey);

        dispatch(editDBObjectAttr({attrKey, value}));
    }

    return (
        <DetailFrame DBOClass={DBOClass} DBObject={DBObject} definition={formDefinition} mode={props.mode} hideDetailFrame={props.hideDetailFrame} formSubmitted={formSubmitted} setErrorMsg={props.setErrorMsg} updateDBObject={updateDBObject} />
    )
}

export default DetailFrameContainer;