// eslint-disable-next-line

import React, { useEffect, useState } from "react";
import { DetailFrameMode } from "../../../../FilesToDistribute/constants";
import { BreadcrumbItemDef, DBObjectType, RootState } from "../../../../FilesToDistribute/types";
import FormFrame from "./FormFrame";
import { DBManager } from "../../../data/lib/DBManager";
import { useSelector } from "react-redux";
import { setErrorMsg } from "../../../../store/reducers/ErrorSlice";
import { setDBObject, setEditedAttrs, setNewDBObject } from "../../../../store/reducers/DBObjectSlice";
import { setEntries } from "../../../../store/reducers/EntrySlice";
import { getRawDBObjectDefinition } from "../../../data/definitions/db-object-definitions";
import useAppDispatch from "../../../../shared/hooks/useAppDispatch";
import { selectActualFormDefinition } from "../../../../store/formDefReducer/selector";

type FormFrameContainerProps = {

}

const FormFrameContainer: React.FC<FormFrameContainerProps> = ({

}) => {
    const dispatch = useAppDispatch();
    const definition = useSelector((state: RootState) => selectActualFormDefinition(state));
    let DBOClass = definition?.DB?.DBOClass ?? undefined;
    const breadcrumbItems: Array<BreadcrumbItemDef> = useSelector((state: RootState) => state.breadcrumb.items);
    const errorMsg = useSelector((state: RootState) => state.errorReducers.msg);
    const setErrMsg = (msg: string) => {
        dispatch(setErrorMsg(msg));
    }

    const [saveDialogVisible, setSaveDialogVisible] = useState(false);
    const [detailFrameMode, setDetailFrameMode] = useState(DetailFrameMode.NEW_ENTRY);
    const [detailFrameVisible, setDetailFrameVisible] = useState(false)
    const entries = useSelector((state: RootState) => state.entries);

    const DBObject = useSelector((state: RootState) => state.dbObject);


    useEffect(() => {        
        let detailItemCondition = "";
        let parentAttribute = DBManager.getEmptyDBObject(DBOClass)?.persistentAttributes[0];
        if (breadcrumbItems.length) {

            if (parentAttribute) {
                let key: string = parentAttribute.key;
                key = (key.startsWith("*")) ? key.substring(1) : key;
                detailItemCondition = `WHERE ${key}='${DBManager.getAttrFromArrByKey(breadcrumbItems[breadcrumbItems.length - 1].DBObject.attributes, parentAttribute.key).value}'`;
            }
        }
        DBManager.getAllDBObjectEntries(DBOClass, definition?.DB?.orderBy,detailItemCondition).then(entrs => {
            dispatch(setEntries(entrs));
            let pa = getRawDBObjectDefinition(DBOClass)?.persistentAttributes ?? [];
            //dispatch(setPersistentAttrs(pa))
        })
        if(DBObject.DBOClass == undefined && DBOClass !== undefined && DBOClass.length){
            dispatch(setNewDBObject({ DBOClass, parentEntry: undefined }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBOClass]);


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
        if (DBObject.isEdited) {
            setSaveDialogVisible(true);
        } else {
            setDetailFrameMode(DetailFrameMode.EDITING_ENTRY);
            dispatch(setDBObject(item));
            const editedAttrs = (item as DBObjectType).attributes.map(attr => { return { key: attr.key, value: attr.value } })
            dispatch(setEditedAttrs(editedAttrs));
            showDetailFrame();
        }
    }


    return (
        <>
            <FormFrame errorMsg={errorMsg} detailFrameVisible={detailFrameVisible} saveDialogVisible={saveDialogVisible} entries={entries} detailFrameMode={detailFrameMode} definition={definition} DBObject={DBObject} hideDetailFrame={hideDetailFrame} setDBObject={setDBObject} editItemHandler={editItemHandler} showDetailFrame={showDetailFrame} setSaveDialogVisible={setSaveDialogVisible} setErrorMsg={setErrMsg} createEntryText={definition.detailFrame.createNewEntryText} />
        </>
    )
}

export default FormFrameContainer;