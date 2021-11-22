// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useState, } from "react";
import { useSelector } from "react-redux";
import { DBManager } from "../../../DBManager";
import { DBObject, RootState } from "../../../types";
import ListFrame from "./ListFrame";

const ListFrameContainer: FC<{ DBObject: DBObject, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function, entries: Array<DBObject> }> = (props) => {
    const formDefinition = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition);

    let DBOClass = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition.DB.DBOClass);

    let colspanNoData = -1;
    if (!props.entries || !props.entries.length) {
        colspanNoData = formDefinition.listFrame.components.length;
        colspanNoData += (formDefinition.listFrame.detailDBOClass) ? 1 : 0;
        colspanNoData += (formDefinition.listFrame.actions) ? 1 : 0;
    }
    return (
        <>
            {formDefinition && <ListFrame definition={formDefinition.listFrame} DBOClass={DBOClass} DBObject={props.DBObject} deleteItemHandler={props.deleteItemHandler} detailClickedHandler={props.detailClickedHandler} editItemHandler={props.editItemHandler} entries={props.entries} colspanNoData={colspanNoData} />}
        </>
    )
}

export default ListFrameContainer;