// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DBManager } from "../../../DBManager";
import { addItemToBreadcrumb } from "../../../store/reducers/BreadcrumbReducer";
import { SagaActions } from "../../../store/sagas";
import { BreadcrumbItemDef, DBObject, DBObjectAttr, RootState } from "../../../types";
import ListFrame from "./ListFrame";

const ListFrameContainer: FC<{ DBObject: DBObject, deleteItemHandler: Function, editItemHandler: Function, entries: Array<DBObject> }> = (props) => {
    const dispatch = useDispatch();
    const formDefinition = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition);

    let DBOClass = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition.DB.DBOClass);

    let colspanNoData = -1;
    if (!props.entries || !props.entries.length) {
        colspanNoData = formDefinition.listFrame.components.length;
        colspanNoData += (formDefinition.listFrame.detailDBOClass) ? 1 : 0;
        colspanNoData += (formDefinition.listFrame.actions) ? 1 : 0;
    }
    
    /**
     * Bylo kliknuto na položku, změní se úroveň
     */
     const detailClickedHandler = async (itm) => {
        let item: DBObject = itm as DBObject;

        const parentAttribute: DBObjectAttr = {
            key: item.attributes[0].key,
            name: item.attributes[0].name, 
            value: item.attributes[0].value
        }
        let breadcrumbAttr = await DBManager.getBreadcrumbAttr(props.DBObject, formDefinition);
        let objBreadcrumbAttr = DBManager.getAttrFromArrByKey(item.attributes, (await breadcrumbAttr).key);

        const newClass = formDefinition.listFrame.detailDBOClass;
        const newBItem: BreadcrumbItemDef = {
            DBOClass: newClass,
            parentAttribute,
            text: objBreadcrumbAttr.value
        };
        dispatch(addItemToBreadcrumb(newBItem))
        dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: newClass })
    }

    return (
        <>
            {formDefinition && <ListFrame definition={formDefinition.listFrame} DBOClass={DBOClass} DBObject={props.DBObject} deleteItemHandler={props.deleteItemHandler} detailClickedHandler={detailClickedHandler} editItemHandler={props.editItemHandler} entries={props.entries} colspanNoData={colspanNoData} />}
        </>
    )
}

export default ListFrameContainer;