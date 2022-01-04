// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import { url } from "inspector";
import { title } from "process";
import React, { EventHandler, useEffect, useState } from "react";
import ErrorDialog from "../ErrorDialog";
import ListFrame from "../ListFrame/ListFrame";
import TreeChoiceDialog from "../TreeChoiceDialog";
import { DetailFrameMode } from "../../../constants";
import { BreadcrumbItemDef, DBObject, FormDef } from "../../../types";
import DetailFrameContainer from "../DetailFrame/DetailFrameContainer";
import ListFrameContainer from "../ListFrame/ListFrameContainer";
import BreadcrumbContainer from "../Breadcrumb/BreadcrumbContainer";
import { DBManager } from "../../../DBManager";

const FormFrame: React.FC<{ errorMsg: string, detailFrameVisible: boolean, saveDialogVisible: boolean, entries: Array<DBObject>, detailFrameMode: DetailFrameMode, definition: FormDef, DBObject: DBObject, hideDetailFrame: EventHandler<any>, setDBObject: Function, editItemHandler: Function, showDetailFrame: Function, setSaveDialogVisible: Function, setErrorMsg: Function }> = (props) => {
  
  return (
    <>
      <BreadcrumbContainer />

      <div className={"form-wrapper"}>
        {(props.definition.detailFrame.createNewEntryText.length != 0 && !props.detailFrameVisible) && <span className={"link " + "add-document-btn mb-3"} onClick={props.showDetailFrame.bind(this, true)}>{props.definition.detailFrame.createNewEntryText}</span>}
        {props.detailFrameVisible &&
          <DetailFrameContainer DBObject={props.DBObject} setErrorMsg={props.setErrorMsg} mode={props.detailFrameMode} hideDetailFrame={props.hideDetailFrame} setDBObject={props.setDBObject} />}
        {<ListFrameContainer DBObject={props.DBObject} editItemHandler={props.editItemHandler} entries={props.entries} />}
        {props.saveDialogVisible &&
          <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={null} noText="Neukládat" onCancel={() => { props.setSaveDialogVisible(false) }} cancelText="Zrušit" />}
        {(props.errorMsg && props.errorMsg.length) && <ErrorDialog msg={props.errorMsg} onOk={() => { props.setErrorMsg("") }} />}
      </div>
    </>
  )
}

export default FormFrame;