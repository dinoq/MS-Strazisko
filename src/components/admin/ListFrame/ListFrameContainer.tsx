// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, } from "react";
import { useSelector } from "react-redux";
import { DBManager } from "../../../helpers/DBManager";
import { addItemToBreadcrumb } from "../../../store/reducers/BreadcrumbSlice";
import { setNewDBObject } from "../../../store/reducers/DBObjectSlice";
import { setErrorMsg } from "../../../store/reducers/ErrorSlice";
import { SagaActions } from "../../../store/sagas";
import { BreadcrumbItemDef, DBObjectType, RootState } from "../../../helpers/types";
import ListFrame from "./ListFrame";
import { useAppDispatch } from "../../../hooks";

const ListFrameContainer: FC<{ editItemHandler: Function }> = (props) => {
    const dispatch = useAppDispatch();
    const formDefinition = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition);
    const DBObject = useSelector((state: RootState) => state.dbObject);
    const entries = useSelector((state: RootState) => state.entries);
    const breadcrumbItems = useSelector((state: RootState) => state.breadcrumb.items);

    let colspanNoData = -1;
    if (!entries || !entries.length) {
        colspanNoData = formDefinition.listFrame.components.length;
        colspanNoData += (formDefinition.listFrame.detailDBOClass) ? 1 : 0;
        colspanNoData += (formDefinition.listFrame.actions) ? 1 : 0;
    }
    
    /**
     * Bylo kliknuto na položku, změní se úroveň
     */
     const detailClickedHandler = async (itm) => {
        let item: DBObjectType = itm as DBObjectType;

        let definitionBreadcrumbAttr = await DBManager.getBreadcrumbAttr(DBObject, formDefinition);
        let objBreadcrumbAttr = DBManager.getAttrFromArrByKey(item.attributes, (await definitionBreadcrumbAttr).key);

        const newClass = formDefinition.listFrame.detailDBOClass;
        const newBItem: BreadcrumbItemDef = {
            DBObject: item,
            text: objBreadcrumbAttr.value
        };
        dispatch(addItemToBreadcrumb(newBItem))
        dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: newClass })

        

        dispatch(setNewDBObject({ DBOClass: newClass ?? undefined, parentEntry: item }));
    }

    

    const deleteItemHandler = async (item: DBObjectType) => {
        let body = {
            className: item.DBOClass,
            deleteId: item.id,
            primaryKey: item.attributes[0].key
        };
        if (formDefinition.listFrame.detailDBOClass) {
            body["detailClass"] = formDefinition.listFrame.detailDBOClass;
        }
        if (formDefinition.listFrame.cantDeleteItemMsg) {
            body["cantDeleteItemMsg"] = formDefinition.listFrame.cantDeleteItemMsg;
        }
        let resultErr = await DBManager.deleteInDB(body);

        if (resultErr && typeof resultErr == "string" && resultErr.length) {
            dispatch(setErrorMsg(resultErr));
        }
    }
    return (
        <>
            {formDefinition && <ListFrame definition={formDefinition.listFrame} DBObject={DBObject} deleteItemHandler={deleteItemHandler} detailClickedHandler={detailClickedHandler} editItemHandler={props.editItemHandler} entries={entries} colspanNoData={colspanNoData} />}
        </>
    )
}

export default ListFrameContainer;