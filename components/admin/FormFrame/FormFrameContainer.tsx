// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import { url } from "inspector";
import { title } from "process";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ErrorDialog from "../ErrorDialog";
import ListFrame from "../ListFrame/ListFrame";
import TreeChoiceDialog from "../TreeChoiceDialog";
import { DetailFrameMode } from "../../../constants/constants";
import { DBObject } from "../../../constants/types";
import DetailFrameContainer from "../DetailFrame/DetailFrameContainer";
import ListFrameContainer from "../ListFrame/ListFrameContainer";
import FormFrame from "./FormFrame";
import { DBManager } from "../../../constants/DBManager";

const FormFrameContainer: React.FC<{ DBObjectClass: string }> = (props) => {
  const definition = DBManager.getFormDefinition(props.DBObjectClass);

  const [breadcrumbItems, setBreadcrumbItemsState] = useState([]);
  const [errorMsg, setErrorMsg] = useState("")

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [detailFrameMode, setDetailFrameMode] = useState(DetailFrameMode.NEW_ENTRY);
  const [detailFrameVisible, setDetailFrameVisible] = useState(false)

  const [DBObject, setDBObject]: [DBObject, any] = useState(DBManager.getEmptyDBObject(props.DBObjectClass));
  const [entries, setEntries] = useState([]);


  useEffect(() => {
    if (!entries.length) {

    } else {

    }

    DBManager.getAllDBObjectEntries(props.DBObjectClass).then(entries => {
      setEntries(entries);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.DBObjectClass]);



  const setBreadcrumbItems = (items) => {
    setBreadcrumbItemsState(items);
  }

  const showDetailFrame = (setEmptyObject?) => {
    /*if (setEmptyObject) {
      setDBObject(getEmptyDBObject(formClassName[formClassName.length - 1]));
    }*/
    setDetailFrameVisible(true);
  }

  const hideDetailFrame = () => {
    setDetailFrameVisible(false);
    /*
    setDBObject(getEmptyDBObject(formClassName[formClassName.length - 1]));
    setObjectManagerMode(DetailFrameMode.NEW_ENTRY);*/
  }


  /**
   * Bylo kliknuto na položku, změní se úroveň
   */
  const detailClickedHandler = async (item) => {

  }

  const deleteItemHandler = async (item) => {
  }

  /**
   * Položka byla přepnuta do editace
   */
  const editItemHandler = (item) => {
    if (DBObject.isEdited) {
      setSaveDialogVisible(true);
    } else {
      setDBObject();
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
      <FormFrame DBObjectClass={props.DBObjectClass} errorMsg={errorMsg} detailFrameVisible={detailFrameVisible} saveDialogVisible={saveDialogVisible} breadcrumbItems={breadcrumbItems} entries={entries} detailFrameMode={detailFrameMode} definition={definition} DBObject={DBObject} hideDetailFrame={hideDetailFrame} setDBObject={setDBObject} setBreadcrumbItems={setBreadcrumbItems} detailClickedHandler={detailClickedHandler} deleteItemHandler={detailClickedHandler} editItemHandler={editItemHandler} showDetailFrame={showDetailFrame} setSaveDialogVisible={setSaveDialogVisible} setErrorMsg={setErrorMsg} updateDBObject={updateDBObject} />
    </>
  )
}

export default FormFrameContainer;