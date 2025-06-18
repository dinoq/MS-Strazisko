// eslint-disable-next-line
import { FC, MouseEventHandler, useState } from "react";
import { useSelector } from "react-redux";
import { DBManager } from "../../../data/lib/DBManager";
import { BreadcrumbItemDef, DBObjectType, RootState } from "../../../../FilesToDistribute/types";
import { getFileComponents } from "../../../../FilesToDistribute/utils";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import { addItemToBreadcrumb } from "../../../../store/reducers/BreadcrumbSlice";
import { setNewDBObject } from "../../../../store/reducers/DBObjectSlice";
import TwoChoiceDialog from "../Dialogs/TwoChoiceDialog";
import ListFrame from "./ListFrame";
import { setEntries } from "../../../../store/reducers/EntrySlice";
import { selectActualFormDefinition } from "../../../../store/formDefReducer/selector";
import { ListFrameComponentType } from "../../../../FilesToDistribute/constants";
import { SagaActions } from "@store/sagaActions";
import ErrorDialog from "../Dialogs/ErrorDialog";

type ListFrameContainerProps = {
    editItemHandler: Function,
    hideDetailFrame: () => void
}

const ListFrameContainer: FC<ListFrameContainerProps> = ({
    editItemHandler,
    hideDetailFrame
}) => {
    const dispatch = useAppDispatch();
    const formDefinition = useSelector((state: RootState) => selectActualFormDefinition(state));
    const DBObject = useSelector((state: RootState) => state.dbObject);
    const entries = useSelector((state: RootState) => state.entries);
    const breadcrumbItems = useSelector((state: RootState) => state.breadcrumb.items);
    const [showDialog, setShowDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DBObjectType | undefined>(undefined)
    const [dialog, setDialog] = useState<string>("");

    let colspanNoData = -1;
    if (!entries || !entries.length) {
        colspanNoData = formDefinition.listFrame.components.length;
        colspanNoData += (formDefinition.listFrame.detailDBOClass) ? 1 : 0;
        colspanNoData += (formDefinition.listFrame.actions) ? 1 : 0;
    }

    /**
     * Bylo kliknuto na položku, změní se úroveň
     */
    const detailClickedHandler = async (item: DBObjectType) => {
        hideDetailFrame();

        let definitionBreadcrumbAttr = DBManager.getBreadcrumbAttr(DBObject, formDefinition);
        let objBreadcrumbAttr = DBManager.getAttrFromArrByKey(item.attributes, definitionBreadcrumbAttr.key);

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
        let result = await DBManager.deleteInDB(body, false);

        if (result?.type === "error") {
            setShowDialog(true);
            setItemToDelete(item);
            //dispatch(setErrorMsg(resultErr));
        } else {
            let afterDeleteMethod = formDefinition.listFrame.afterDeleteMethod;
            if (afterDeleteMethod) {
                let methodName = afterDeleteMethod.substring(0, afterDeleteMethod.indexOf(";"));

                let rawParams = afterDeleteMethod.split(";").slice(1);
                let params: Array<string> = [];
                for (const rawParam of rawParams) {
                    let evaluated = DBManager.substituteExpression(rawParam, item);
                    params.push(evaluated);
                }

                result = await DBManager.runServerMethod(methodName, params);

            }
            let fileComponents = getFileComponents(formDefinition.detailFrame);
            if(fileComponents.length){
                for(const component of fileComponents){
                    // TODO - pohlídat že se smazaly soubory a až pak mazat data z databáze?? Aby se nestávalo že uživatel smazal data, ale soubory zůstaly na disku
                    let evaluated = DBManager.substituteExpression(component.componentSpecificProps?.path, item);
                    console.log('[evaluated]: ', [evaluated]);
                    result = await DBManager.runServerMethod("deleteFile", [evaluated], false);
                    console.log('resultErr: ', result);
                    if(result?.type === "warning" && result?.message?.includes("resource not found")){
                        setDialog("Daný soubor '" + evaluated + "' nebyl nalezen. Je možné že byl smazán již dříve či došlo k nějaké chybě.")
                    }else if(result?.type === "information"){                    
                        window.location.reload();
                    }
                    /*if(component.componentType === ListFrameComponentType.ImagePreview){ // thumbnail was deleted and now delete "main" image
                        evaluated = evaluated.replace("/thumbnails", "");
                        resultErr = await DBManager.runServerMethod("deleteFile", [evaluated]);
                    }*/

                }
            }else{           
                window.location.reload();
            }

        }
    }

    const cancelForceDeleteDialog = () => {
        setShowDialog(false);
        setItemToDelete(undefined);
    }

    const confirmForceDeleteDialog = () => {
        if(itemToDelete !== undefined){
            setShowDialog(false);
            deleteItemHandler(itemToDelete, true);
            setItemToDelete(undefined);
        }
    }

    return (
        <>
            {formDefinition && <ListFrame components={formDefinition?.listFrame?.components} actions={formDefinition?.listFrame?.actions} DBObject={DBObject} deleteItemHandler={deleteItemHandler} detailClickedHandler={detailClickedHandler} editItemHandler={editItemHandler} entries={entries} colspanNoData={colspanNoData} detailDBOClassLen={formDefinition?.listFrame?.detailDBOClass?.length ?? 0} />}
            {showDialog && <TwoChoiceDialog msg={formDefinition.listFrame.forceDeleteItemMsg || "Daný záznam obsahuje podpoložky. Opravdu chcete smazat (vč. podpoložek)?"} onYes={confirmForceDeleteDialog} onNo={cancelForceDeleteDialog} />}
            {dialog && dialog.length !== 0 && <ErrorDialog msg={dialog} onOk={() => window.location.reload()}/>}
        </>
    )
}

export default ListFrameContainer;