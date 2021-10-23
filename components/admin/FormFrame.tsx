// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import { url } from "inspector";
import { title } from "process";
import React, { useEffect, useState } from "react";
import { getFormDefinition } from "../../constants/form-definitions";
import Breadcrumb from "./Breadcrumb";
import ErrorDialog from "./ErrorDialog";
import ListFrame from "./ListFrame/ListFrame";
import TreeChoiceDialog from "./TreeChoiceDialog";
import { DetailFrameMode } from "../../constants/constants";
import { DBObject } from "../../constants/types";
import DetailFrameContainer from "./DetailFrame/DetailFrameContainer";
import { DBManager } from "./DBManager";
import ListFrameContainer from "./ListFrame/ListFrameContainer";

const FormFrame: React.FC<{ DBObjectClass: string }> = (props) => {
  const definition = getFormDefinition(props.DBObjectClass);

  const [breadcrumbItems, setBreadcrumbItemsState] = useState([]);
  const [errorMsg, setErrorMsg] = useState("")

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [detailFrameMode, setDetailFrameMode] = useState(DetailFrameMode.NEW_ENTRY);
  const [detailFrameVisible, setDetailFrameVisible] = useState(false)

  const [DBObject, setDBObject]: [DBObject, any] = useState(DBManager.getEmptyDBObject(props.DBObjectClass));
  const [entries, setEntries] = useState([]);


  useEffect(() => {
    if(!entries.length){

    }else{

    }

    fetch("/api/admin/data?className=" + props.DBObjectClass).then((resp) => {
      if (resp.status == 200) {
        resp.json().then((json) => {
          setEntries(json);
        });
      } else {
        resp.text().then((value) => {
          console.log("tvalue: ", value);
        });
      }
    });
  }, [props.DBObjectClass]);

  const setBreadcrumbItems = (items) => {
    setBreadcrumbItemsState(items);
  }

  const showDetailFrame = (setEmptyObject?) => {
    /*if (setEmptyObject) {
      setDBObject(getEmptyDBObject(formClassName[formClassName.length - 1]));
    }
    setObjectManagerVisible(true)*/
  }

  const hideDetailFrame = () => {
    /*setObjectManagerVisible(false);
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

  const editItemHandler = (item) => {
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} setItems={setBreadcrumbItems} />

      <div className={"form-wrapper"}>
        {(definition.detailFrame.createNewEntryText.length && !detailFrameVisible) && <span className={"link " + "add-document-btn mb-3"} onClick={showDetailFrame.bind(this, true)}>{definition.detailFrame.createNewEntryText}</span>}
        {detailFrameVisible &&
                <DetailFrameContainer setErrorMsg={setErrorMsg} mode={detailFrameMode} hideDetailFrame={hideDetailFrame} DBObject={DBObject} setDBObject={setDBObject} />}
        <ListFrameContainer DBObjectClass={props.DBObjectClass} DBObject={DBObject} detailClickedHandler={detailClickedHandler} deleteItemHandler={deleteItemHandler} editItemHandler={editItemHandler} entries={entries} />
        {saveDialogVisible &&
          <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={null} noText="Neukládat" onCancel={() => { setSaveDialogVisible(false) }} cancelText="Zrušit" />}
        {(errorMsg && errorMsg.length) && <ErrorDialog msg={errorMsg} onOk={() => { setErrorMsg("") }} />}
      </div>
    </>
  )
}

export default FormFrame;