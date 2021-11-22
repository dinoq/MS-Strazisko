// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import React, { useEffect, useState } from "react";
import { DetailFrameMode } from "../../../constants";
import { BreadcrumbItemDef, BreadcrumbState, DBObject, RootState } from "../../../types";
import FormFrame from "./FormFrame";
import { DBManager } from "../../../DBManager";
import { useDispatch, useSelector } from "react-redux";
import { addItemToBreadcrumb } from "../../../store/reducers/BreadcrumbReducer";
import { SagaActions } from "../../../store/sagas";

const FormFrameContainer: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const definition = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition);
    const breadcrumbItems: Array<BreadcrumbItemDef>= useSelector((state: RootState) => state.breadcrumb.items);
    const [errorMsg, setErrorMsg] = useState("")

    const [saveDialogVisible, setSaveDialogVisible] = useState(false);
    const [detailFrameMode, setDetailFrameMode] = useState(DetailFrameMode.NEW_ENTRY);
    const [detailFrameVisible, setDetailFrameVisible] = useState(false)
    const [entries, setEntries] = useState([]);

    let DBOClass = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition.DB.DBOClass);

    const [DBObject, setDBObject]: [DBObject, any] = useState(DBManager.getEmptyDBObject(DBOClass));

    const [detailItemCondition, setDetailItemCondition] = useState("");

    //const definition = DBManager.getFormDefinition(DBOClass);

    useEffect(() => {
        setDBObject(DBManager.getEmptyDBObject(DBOClass));
        DBManager.getAllDBObjectEntries(DBOClass, /*definition.DB.orderBy, */detailItemCondition).then(entries => {
            setEntries(entries);
        })
        setDetailItemCondition("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBOClass]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBObject]);

    useEffect(() => {
        //dispatch(addItemToBreadcrumb({ DBOClass: props.DBOClass, DBObject: DBManager.getEmptyDBObject(props.DBOClass), text: "" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showDetailFrame = () => {
        /*if (setEmptyObject) {
          setDBObject(getEmptyDBObject(formClassName[formClassName.length - 1]));
        }*/
        setDetailFrameVisible(true);
    }

    const hideDetailFrame = () => {
        setDetailFrameVisible(false);
        setDBObject(DBManager.getEmptyDBObject(DBOClass));
        setDetailFrameMode(DetailFrameMode.NEW_ENTRY);
    }

    /**
     * Bylo kliknuto na položku, změní se úroveň
     */
    const detailClickedHandler = async (itm) => {
        let item: DBObject = itm as DBObject;

        let prevPrimaryKey = item.attributes[0].key;
        let prevPrimaryKeyValue = item.attributes[0].value;
        setDetailItemCondition("WHERE " + prevPrimaryKey + "='" + prevPrimaryKeyValue + "'");
        let breadcrumbAttr = DBManager.getBreadcrumbAttr(DBObject);
        let objBreadcrumbAttr = DBManager.getAttrFromArrByKey(item.attributes, (await breadcrumbAttr).key);
        
        const newClass = definition.listFrame.detailDBOClass;
        const newBItem: BreadcrumbItemDef = {
            DBOClass: newClass,
            DBObject,
            text: objBreadcrumbAttr.value
        };
        dispatch(addItemToBreadcrumb(newBItem))
        dispatch({type: SagaActions.SET_FORM_DEFINITIONS, FID: newClass})
        /*setBreadcrumbItems(prevState => {
            return [...prevState, { DBOClass: (await definition).listFrame.detailDBOClass, text: objBreadcrumbAttr.value }]
        })*/
    }

    const deleteItemHandler = async (item: DBObject) => {
        console.log('item: ', item);
        let body = {
            deleteId: item.id,
            className: item.DBOClass
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
            <FormFrame errorMsg={errorMsg} detailFrameVisible={detailFrameVisible} saveDialogVisible={saveDialogVisible} entries={entries} detailFrameMode={detailFrameMode} definition={definition} DBObject={DBObject} hideDetailFrame={hideDetailFrame} setDBObject={setDBObject} detailClickedHandler={detailClickedHandler} deleteItemHandler={deleteItemHandler} editItemHandler={editItemHandler} showDetailFrame={showDetailFrame} setSaveDialogVisible={setSaveDialogVisible} setErrorMsg={setErrorMsg} updateDBObject={updateDBObject} />
        </>
    )
}

export default FormFrameContainer;