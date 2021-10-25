import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../constants/constants";
import { getFormDefinition } from "../../../constants/form-definition-functions";
import { DBObject } from "../../../constants/types";
import ErrorDialog from "../ErrorDialog";
import DetailFrame from "./DetailFrame";

const DetailFrameContainer: FC<{ DBObjectClass: string, DBObject: DBObject, mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, setDBObject: Function, setErrorMsg: Function, updateDBObject: Function }> = (props) => {
    let formDefinition = getFormDefinition(props.DBObjectClass);
    
    const formSubmitted = async (event) => {
        event.preventDefault();
    };

    const updateDBObject = (objectParamName, e) => {
        props.setDBObject(prevState => {
            let edited = { ...prevState.edited };
            edited[objectParamName] = e.target.value;
            return { ...prevState, edited };
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
        <DetailFrame DBObjectClass={props.DBObjectClass} DBObject={props.DBObject} definition={formDefinition} mode={props.mode} hideDetailFrame={props.hideDetailFrame} formSubmitted={formSubmitted} setErrorMsg={props.setErrorMsg} updateDBObject={updateDBObject}/>
    )
}

export default DetailFrameContainer;