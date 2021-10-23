// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import { url } from "inspector";
import { title } from "process";
import React, { useState } from "react";
import { FormDefinitions } from "../../constants/form-definitions";
import Breadcrumb from "./Breadcrumb";
import ErrorDialog from "./ErrorDialog";
import ListFrame from "./ListFrame/ListFrame";
import TreeChoiceDialog from "./TreeChoiceDialog";
import { DetailFrameMode } from "../../constants/constants";
import { DBObject } from "../../constants/types";
import DetailFrameContainer from "./DetailFrame/DetailFrameContainer";

const FormFrame: React.FC<{ DBObjectClass: string }> = (props) => {
    const definition = FormDefinitions[props.DBObjectClass];
    
  const [breadcrumbItems, setBreadcrumbItemsState] = useState([]);
  const [objectManagerMode, setObjectManagerMode] = useState(DetailFrameMode.NEW_ENTRY);
  const [errorMsg, setErrorMsg] = useState("")
  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [objectManagerVisible, setObjectManagerVisible] = useState(false)
  const [DBObject, setDBObject]: [DBObject, any] = useState(getEmptyDBObject(formClassName[formClassName.length - 1]));
  
  const setBreadcrumbItems = (items) => {
    setBreadcrumbItemsState(items);
  }

    return (
        <>
            <Breadcrumb items={breadcrumbItems} setItems={setBreadcrumbItems} />
    
            <div className={"form-wrapper"}>
                {!objectManagerVisible && <span className={"link " + "add-document-btn mb-3"} onClick={showObjectManager.bind(this, true)}>{title}</span>}
                {objectManagerVisible &&
                <DetailFrameContainer url={url} setErrorMsg={setErrorMsg} mode={objectManagerMode} hideObjectManager={hideObjectManager} DBObject={DBObject} setDBObject={setDBObject} />}
                <ListFrame DBObjectClass={props.DBObjectClass} DBObject={DBObject} detailClickedHandler={detailClickedHandler} deleteItemHandler={deleteItemHandler} editItemHandler={editItemHandler} />
                {saveDialogVisible &&
                <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={null} noText="Neukládat" onCancel={() => { setSaveDialogVisible(false) }} cancelText="Zrušit" />}
                {(errorMsg && errorMsg.length) && <ErrorDialog msg={errorMsg} onOk={() => { setErrorMsg("") }} />}
            </div>
        </>
    )
}

export default FormFrame;