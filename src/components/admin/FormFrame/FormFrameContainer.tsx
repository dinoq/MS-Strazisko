// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import React, { useEffect, useState } from "react";
import { DetailFrameMode } from "../../../constants";
import { BreadcrumbItemDef, BreadcrumbState, DBObject, DBObjectAttr, RootState } from "../../../types";
import FormFrame from "./FormFrame";
import { DBManager } from "../../../DBManager";
import { useDispatch, useSelector } from "react-redux";
import { addItemToBreadcrumb } from "../../../store/reducers/BreadcrumbReducer";
import { SagaActions } from "../../../store/sagas";
import { setErrorMsg } from "../../../store/reducers/ErrorReducer";
import { setDBObject, setNewDBObject, setNewEmptyDBObject, setPersistentAttrs } from "../../../store/reducers/DBObjectReducer";
import { setEntries } from "../../../store/reducers/EntryReducer";

const FormFrameContainer: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const definition = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition);
    let DBOClass = definition.DB.DBOClass;
    const breadcrumbItems: Array<BreadcrumbItemDef> = useSelector((state: RootState) => state.breadcrumb.items);
    const errorMsg = useSelector((state: RootState) => state.errorReducers.msg);
    const setErrMsg = (msg: string) => {
        dispatch(setErrorMsg(msg));
    }

    const [saveDialogVisible, setSaveDialogVisible] = useState(false);
    const [detailFrameMode, setDetailFrameMode] = useState(DetailFrameMode.NEW_ENTRY);
    const [detailFrameVisible, setDetailFrameVisible] = useState(false)
    const entries = useSelector((state: RootState) => state.entries);


    //const [DBObject, setDBObject]: [DBObject, any] = useState(DBManager.getEmptyDBObject(DBOClass));
    const DBObject = useSelector((state: RootState) => state.dbObject);
    //dispatch(setNewEmptyDBObject(DBOClass));

    //const definition = DBManager.getFormDefinition(DBOClass);

    useEffect(() => {
        /*if (DBOClass.length && !breadcrumbItems.length) { // DBOClass is set, but there is no item in breadcrumb => add root item
            const newClass = DBOClass;
            const newBItem: BreadcrumbItemDef = {
                DBObject: DBObject,
                text: ""
            };
            dispatch(addItemToBreadcrumb(newBItem))
        }*/
/*
        let detailItemCondition = "";
        if (breadcrumbItems.length) {
            let parentAttribute = DBManager.getEmptyDBObject(DBOClass)?.persistentAttributes[0];

            if (parentAttribute) {
                let key: string = parentAttribute.key;
                key = (key.startsWith("*")) ? key.substring(1) : key;
                detailItemCondition = `WHERE ${key}='${DBManager.getAttrFromArrByKey(breadcrumbItems[breadcrumbItems.length - 1].DBObject.attributes, parentAttribute.key).value}'`;
            }
        }
        DBManager.getAllDBObjectEntries(DBOClass, detailItemCondition).then(entrs => {
            setEntries(entrs);
        })

        dispatch(setNewDBObject({ DBOClass, parentEntry: (entries.length ? entries[0] : undefined) }));*/
        
        let detailItemCondition = "";
        if (breadcrumbItems.length) {
            let parentAttribute = DBManager.getEmptyDBObject(DBOClass)?.persistentAttributes[0];

            if (parentAttribute) {
                let key: string = parentAttribute.key;
                key = (key.startsWith("*")) ? key.substring(1) : key;
                detailItemCondition = `WHERE ${key}='${DBManager.getAttrFromArrByKey(breadcrumbItems[breadcrumbItems.length - 1].DBObject.attributes, parentAttribute.key).value}'`;
            }
        }
        DBManager.getAllDBObjectEntries(DBOClass, detailItemCondition).then(entrs => {
            dispatch(setEntries(entrs));
            dispatch(setPersistentAttrs(entrs.length? entrs[0].persistentAttributes : []))
        })
        if(DBObject.DBOClass == undefined && DBOClass.length){
            dispatch(setNewDBObject({ DBOClass, parentEntry: undefined }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBOClass]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBObject]);

    const showDetailFrame = () => {
        /*if (setEmptyObject) {
          setDBObject(getEmptyDBObject(formClassName[formClassName.length - 1]));
        }*/
        setDetailFrameVisible(true);
    }

    const hideDetailFrame = () => {
        setDetailFrameVisible(false);
        dispatch(setDBObject(DBManager.getClearedDBObject(DBObject)));
        setDetailFrameMode(DetailFrameMode.NEW_ENTRY);
    }

    /**
     * Položka byla přepnuta do editace
     */
    const editItemHandler = (item) => {
        console.log('item: ', item);
        if (DBObject.isEdited) {
            setSaveDialogVisible(true);
        } else {
            setDetailFrameMode(DetailFrameMode.EDITING_ENTRY);
            dispatch(setDBObject(item));
            (item as DBObject).editedAttrs = (item as DBObject).attributes.map(attr => { return { key: attr.key, value: attr.value } })
            console.log('item: ', item);
            showDetailFrame();
        }
    }


    return (
        <>
            <FormFrame errorMsg={errorMsg} detailFrameVisible={detailFrameVisible} saveDialogVisible={saveDialogVisible} entries={entries} detailFrameMode={detailFrameMode} definition={definition} DBObject={DBObject} hideDetailFrame={hideDetailFrame} setDBObject={setDBObject} editItemHandler={editItemHandler} showDetailFrame={showDetailFrame} setSaveDialogVisible={setSaveDialogVisible} setErrorMsg={setErrMsg} />
        </>
    )
}

export default FormFrameContainer;