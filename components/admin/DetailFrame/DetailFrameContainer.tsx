import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../constants/constants";
import { DBObject } from "../../../constants/types";
import ErrorDialog from "../ErrorDialog";
import DetailFrame from "./DetailFrame";

const DetailFrameContainer: FC<{DBObject: DBObject, setDBObject: Function, url: string, setErrorMsg: Function, mode:DetailFrameMode, hideObjectManager: MouseEventHandler<HTMLInputElement>}>= (props) => {
    const formSubmitted = async (event) => {
        event.preventDefault();
        let conditionError = false;
       
    };

    const updateDBObject = (objectParamName, e) => {
        props.setDBObject(prevState => {
            let edited = { ...prevState.edited };
            edited[objectParamName] = e.target.value;
            return { ...prevState, edited };
        })
    }

    console.log("props.DBObject2", props.DBObject);
    useEffect(() => {
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
    }, [props.headerItems])
    console.log("props.DBObject3", props.DBObject);
    return (
        <DetailFrame />
    )
}

export default DetailFrameContainer;