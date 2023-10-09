// eslint-disable-next-line
//import styles from "./ListFrame.module.css";

import { FC, MouseEventHandler, useState } from "react";
import { useSelector } from "react-redux";
import { DBManager } from "../../../helpers/DBManager";
import { BreadcrumbItemDef, DBObjectType, RootState } from "../../../helpers/types";
import { getFileComponents } from "../../../helpers/utils";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { addItemToBreadcrumb } from "../../../store/reducers/BreadcrumbSlice";
import { setNewDBObject } from "../../../store/reducers/DBObjectSlice";
import { SagaActions } from "../../../store/sagas";
import Dialog from "../Dialogs/TwoChoiceDialog";
import ListFrame from "./ListFrame";
import { setEntries } from "../../../store/reducers/EntrySlice";

const ListFrameContainer: FC<{ editItemHandler: Function, hideDetailFrame: MouseEventHandler<HTMLInputElement> }> = (props) => {
    const dispatch = useAppDispatch();
    const formDefinition = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition);
    const DBObject = useSelector((state: RootState) => state.dbObject);
    const entries = useSelector((state: RootState) => state.entries);
    const breadcrumbItems = useSelector((state: RootState) => state.breadcrumb.items);
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(undefined)

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
        props.hideDetailFrame(undefined);

        let item: DBObjectType = itm as DBObjectType;

        let definitionBreadcrumbAttr = await DBManager.getBreadcrumbAttr(DBObject, formDefinition);
        let objBreadcrumbAttr = DBManager.getAttrFromArrByKey(item.attributes, (await definitionBreadcrumbAttr).key);

        const newClass = formDefinition.listFrame.detailDBOClass;
        const newBItem: BreadcrumbItemDef = {
            DBObject: item,
            text: objBreadcrumbAttr.value
        };
        dispatch(addItemToBreadcrumb(newBItem))
        dispatch(setEntries([]));// TODO smazat tento řádek -> předělat volání dispatch(setNewDBObject) níže na saga action tak, že fetchne entries a nastaví je => až po nastavení v této sage volat níže uvedené 'dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: newClass })' (rovnez v ale v sage a odsud odstranit)... DUVOD - Při přechodu mezi formuláři (minimálně u photo) se děje to, že se nejprve změní objekt ve storu=>následně se nahraje nový formulář a až opožděně se nastaví entries v reakci na dispatch(setNewDBObject) v FormFrameContainer v useeffect (zřejmě se toto useeffect volá až po 'dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: newClass })', protože kdyý jsem vložil 'dispatch(setEntries([]))', tak to nepomohlo)
        dispatch(setNewDBObject({ DBOClass: newClass ?? undefined, parentEntry: item }));
        dispatch({ type: SagaActions.SET_FORM_DEFINITIONS, FID: newClass })
    }

    const deleteItemHandler = async (item: DBObjectType, forceDelete: boolean = false) => {
        let body = {
            className: item.DBOClass,
            deleteId: item.id,
            primaryKey: item.attributes[0].key,
            forceDelete
        };
        if (formDefinition.listFrame.detailDBOClass) {
            body["detailClass"] = formDefinition.listFrame.detailDBOClass;
        }
        if (formDefinition.listFrame.forceDeleteItemMsg) {
            body["forceDeleteItemMsg"] = formDefinition.listFrame.forceDeleteItemMsg;
        }
        let resultErr = await DBManager.deleteInDB(body);
        console.log('resultErr: ', resultErr);

        if (resultErr && typeof resultErr == "string" && resultErr.length) {
            setShowDialog(true);
            setItemToDelete(item);
            //dispatch(setErrorMsg(resultErr));
        }else{
            
        let afterDeleteMethod = formDefinition.listFrame.afterDeleteMethod;
        console.log('afterDeleteMethod: ', afterDeleteMethod);
            if(afterDeleteMethod){
                let methodName = afterDeleteMethod.substring(0, afterDeleteMethod.indexOf("("));
                    
                let rawParams = (afterDeleteMethod.substring(methodName.length+1, afterDeleteMethod.length-1)).split(",");
                let params: Array<string> = [];
                for(const rawParam of rawParams){
                    let evaluated = DBManager.substituteExpression(rawParam, item);
                    params.push(evaluated);
                }
                
                resultErr = await DBManager.runServerMethod(methodName, params);

            }
            let fileComponents = getFileComponents(formDefinition.listFrame);
            if(fileComponents.length){
                let evaluated = DBManager.substituteExpression(fileComponents[0].transformation, item);

                resultErr = await DBManager.runServerMethod("deleteFile", [evaluated]);

            }
            
        }
    }


    const cancelForceDeleteDialog = ()=>{
        setShowDialog(false);
        setItemToDelete(undefined);
    }

    const confirmForceDeleteDialog = () => {
        setShowDialog(false);
        deleteItemHandler(itemToDelete, true);
        setItemToDelete(undefined);
    }

    return (
        <>
            {formDefinition && <ListFrame components={formDefinition?.listFrame?.components} actions={formDefinition?.listFrame?.actions} DBObject={DBObject} deleteItemHandler={deleteItemHandler} detailClickedHandler={detailClickedHandler} editItemHandler={props.editItemHandler} entries={entries} colspanNoData={colspanNoData} detailDBOClassLen={formDefinition?.listFrame?.detailDBOClass?.length ?? 0} />}
            {showDialog && <Dialog msg={formDefinition.listFrame.forceDeleteItemMsg} onYes={confirmForceDeleteDialog} onNo={cancelForceDeleteDialog}/>}
        </>
    )
}

export default ListFrameContainer;