"use client"

import React, { useEffect, useState } from "react";
import { DetailFrameMode } from "../../../../FilesToDistribute/constants";
import { BreadcrumbItemDef, DBObjectType, RootState } from "../../../../FilesToDistribute/types";
import FormFrame from "./FormFrame";
import { DBManager } from "../../../data/lib/DBManager";
import { useSelector } from "react-redux";
import { setErrorMsg } from "../../../../store/reducers/ErrorSlice";
import { setDBObject, setEditedAttrs, setNewDBObject } from "../../../../store/reducers/DBObjectSlice";
import { setEntries } from "../../../../store/reducers/EntrySlice";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { selectActualFormDefinition } from "../../../../store/formDefReducer/selector";
import { SagaActions } from "@store/sagaActions";

type FormFrameContainerProps = {
    formID: string

}

const FormFrameContainer: React.FC<FormFrameContainerProps> = ({
    formID
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

    const DBObject: DBObjectType = useSelector((state: RootState) => state.dbObject);





    const [pageFormDefinitionLoaded, setPageFormDefinitionLoaded] = useState(false);

    useEffect(() => {
        dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: formID });
    }, [dispatch])

    useEffect(() => {
        setPageFormDefinitionLoaded(true)
    }, [DBOClass])




    useEffect(() => {
        let detailItemCondition;
        let parentAttribute = DBManager.getEmptyDBObject(DBOClass)?.persistentAttributes[0];
        if (breadcrumbItems.length) {

            if (parentAttribute) {
                let key: string = parentAttribute.key;
                key = (key.startsWith("*")) ? key.substring(1) : key;
                detailItemCondition = JSON.stringify({[key]: DBManager.getAttrFromArrByKey(breadcrumbItems[breadcrumbItems.length - 1].DBObject.attributes, parentAttribute.key).value});
            }
        }
        DBManager.getAllDBObjectEntries(DBOClass, definition?.DB?.orderBy, detailItemCondition).then(entrs => {
            dispatch(setEntries(entrs));
        })
        if (DBObject.DBOClass == undefined && DBOClass !== undefined && DBOClass.length) {
            dispatch(setNewDBObject({ DBOClass, parentEntry: undefined }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBOClass]);


    const showDetailFrame = () => {
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
            {
            pageFormDefinitionLoaded && <FormFrame errorMsg={errorMsg} detailFrameVisible={detailFrameVisible} saveDialogVisible={saveDialogVisible} detailFrameMode={detailFrameMode} hideDetailFrame={hideDetailFrame} editItemHandler={editItemHandler} showDetailFrame={showDetailFrame} setSaveDialogVisible={setSaveDialogVisible} setErrorMsg={setErrMsg} createEntryText={definition.detailFrame.createNewEntryText} />
            }
        </>
    )
}

export default FormFrameContainer;