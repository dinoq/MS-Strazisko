// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import { url } from "inspector";
import { title } from "process";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ErrorDialog from "../ErrorDialog";
import ListFrame from "../ListFrame/ListFrame";
import TreeChoiceDialog from "../TreeChoiceDialog";
import { DetailFrameMode } from "../../../src/constants";
import { BreadcrumbItemDef, DBObject } from "../../../src/types";
import DetailFrameContainer from "../DetailFrame/DetailFrameContainer";
import ListFrameContainer from "../ListFrame/ListFrameContainer";
import FormFrame from "./FormFrame";
import { DBManager } from "../../../src/DBManager";

const FormFrameContainer: React.FC<{ DBObjectClass: string }> = (props) => {
    //const [DBObjectClass, setDBObjectClass] = useState(props.DBObjectClass);
    const [breadcrumbItems, setBreadcrumbItems]: [Array<BreadcrumbItemDef>, Function] = useState([{DBObjectClass: props.DBObjectClass, text: ""}]);
    const [errorMsg, setErrorMsg] = useState("")

    const [saveDialogVisible, setSaveDialogVisible] = useState(false);
    const [detailFrameMode, setDetailFrameMode] = useState(DetailFrameMode.NEW_ENTRY);
    const [detailFrameVisible, setDetailFrameVisible] = useState(false)
    const [entries, setEntries] = useState([]);

    let DBObjectClass = breadcrumbItems[breadcrumbItems.length - 1].DBObjectClass;
    console.log('DBObjectClass: ', DBObjectClass);

    const [DBObject, setDBObject]: [DBObject, any] = useState(DBManager.getEmptyDBObject(DBObjectClass));
    console.log('DBObjectrrrrrr: ', DBObject);

    
    const definition = DBManager.getFormDefinition(DBObjectClass);

    console.log('breadcrumbItems: ', breadcrumbItems);
    useEffect(() => {
        if (!entries.length) {

        } else {

        }

        console.log('DBObjectClass:eff ', DBObjectClass);
        setDBObject(DBManager.getEmptyDBObject(DBObjectClass));
        DBManager.getAllDBObjectEntries(DBObjectClass, definition.DB.orderBy).then(entries => {
            setEntries(entries);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBObjectClass]);



    const showDetailFrame = () => {
        /*if (setEmptyObject) {
          setDBObject(getEmptyDBObject(formClassName[formClassName.length - 1]));
        }*/
        setDetailFrameVisible(true);
    }

    const hideDetailFrame = () => {
        setDetailFrameVisible(false);
        setDBObject(DBManager.getEmptyDBObject(DBObjectClass));
        setDetailFrameMode(DetailFrameMode.NEW_ENTRY);
    }


    /**
     * Bylo kliknuto na položku, změní se úroveň
     */
    const detailClickedHandler = async (itm) => {
        let item: DBObject = itm as DBObject;
        console.log('item: ', item);
        let breadcrumbAttr = DBManager.getBreadcrumbAttr(DBObject);
        let objBreadcrumbAttr = DBManager.getAttrOrComponentFromArrByKey(item.attributes, breadcrumbAttr.key);
        setBreadcrumbItems(prevState =>{
            return [...prevState, {DBObjectClass: definition.listFrame.detailDBOClass, text:objBreadcrumbAttr.value}]
        })
    }

    const deleteItemHandler = async (item: DBObject) => {
        console.log('item: ', item);

        let body = {
            deleteId: item.id,
            className: item.DBObjectClass
        };
        if (definition.listFrame.detailDBOClass) {
            body["detailClass"] = definition.listFrame.detailDBOClass;
            body["primaryKey"] = item.attributes[0].key;
        }
        if (definition.listFrame.cantDeleteItemMsg) {
            body["cantDeleteItemMsg"] = definition.listFrame.cantDeleteItemMsg;
        }
        let resultErr = await DBManager.deleteInDB(body);

        if (resultErr && typeof resultErr == "string" && resultErr.length) {
            setErrorMsg(resultErr);
        }
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
            setDBObject(item);
            (item as DBObject).editedAttrs = (item as DBObject).attributes.map(attr => { return { key: attr.key, value: attr.value } })
            console.log('item: ', item);
            showDetailFrame();
        }
        /*if (isEmptyObject(DBObject.actual, shownLevel) || DBObject.actual == DBObject.edited) {
        setDBObject(prevState => {
          return { ...prevState, actual: item, edited: item }
        });
        setObjectManagerMode(ObjectManagerMode.EDITING_ENTRY);
        showObjectManager();
      } else {
        setSaveDialogVisible(true);
        setDBObject(prevState => {
          return { ...prevState, toSet: item };
        });
      }*/
    }

    const updateDBObject = (item) => {
    }

    return (
        <>
            <FormFrame DBObjectClass={DBObjectClass} errorMsg={errorMsg} detailFrameVisible={detailFrameVisible} saveDialogVisible={saveDialogVisible} breadcrumbItems={breadcrumbItems} entries={entries} detailFrameMode={detailFrameMode} definition={definition} DBObject={DBObject} hideDetailFrame={hideDetailFrame} setDBObject={setDBObject} setBreadcrumbItems={setBreadcrumbItems} detailClickedHandler={detailClickedHandler} deleteItemHandler={deleteItemHandler} editItemHandler={editItemHandler} showDetailFrame={showDetailFrame} setSaveDialogVisible={setSaveDialogVisible} setErrorMsg={setErrorMsg} updateDBObject={updateDBObject} />
        </>
    )
}

export default FormFrameContainer;