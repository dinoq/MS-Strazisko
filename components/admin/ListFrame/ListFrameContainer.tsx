// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, useState, } from "react";
import { getFormDefinition } from "../../../constants/form-definition-functions";
import { DBObject } from "../../../constants/types";
import ListFrame from "./ListFrame";

const ListFrameContainer: FC<{ DBObjectClass: string, DBObject: DBObject, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function, entries: Array<DBObject> }> = (props) => {
    let formDefinition = getFormDefinition(props.DBObjectClass);
    let colspanNoData = -1;
    if (!props.entries || !props.entries.length) {
        colspanNoData = formDefinition.listFrame.components.length;
        colspanNoData += (formDefinition.listFrame.detailDBOClass) ? 1 : 0;
        colspanNoData += (formDefinition.listFrame.actions) ? 1 : 0;
    }
    return (
        <>
            {formDefinition && <ListFrame definition={formDefinition.listFrame} DBObjectClass={props.DBObjectClass} DBObject={props.DBObject} deleteItemHandler={props.deleteItemHandler} detailClickedHandler={props.detailClickedHandler} editItemHandler={props.editItemHandler} entries={props.entries} colspanNoData={colspanNoData} />}
        </>
    )
}

export default ListFrameContainer;