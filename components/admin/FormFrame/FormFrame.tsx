// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import { url } from "inspector";
import { title } from "process";
import React, { EventHandler, useEffect, useState } from "react";
import ErrorDialog from "../ErrorDialog";
import ListFrame from "../ListFrame/ListFrame";
import TreeChoiceDialog from "../TreeChoiceDialog";
import { DetailFrameMode } from "../../../constants/constants";
import { DBObject, FormDef } from "../../../constants/types";
import DetailFrameContainer from "../DetailFrame/DetailFrameContainer";
import { DBManager } from "../DBManager";
import ListFrameContainer from "../ListFrame/ListFrameContainer";
import BreadcrumbContainer from "../Breadcrumb/BreadcrumbContainer";

const FormFrame: React.FC<{ DBObjectClass: string, errorMsg: string, detailFrameVisible: boolean, saveDialogVisible: boolean, breadcrumbItems: Array<any>, entries: Array<DBObject>, detailFrameMode: DetailFrameMode, definition: FormDef, DBObject: DBObject, hideDetailFrame: EventHandler<any>, setDBObject: Function, setBreadcrumbItems: Function, detailClickedHandler: Function, deleteItemHandler: Function, editItemHandler: Function, showDetailFrame: Function, setSaveDialogVisible: Function, setErrorMsg: Function, updateDBObject: Function }> = (props) => {
  return (
    <>
      <BreadcrumbContainer items={props.breadcrumbItems} setItems={props.setBreadcrumbItems} />

      <div className={"form-wrapper"}>
        {(props.definition.detailFrame.createNewEntryText.length != 0 && !props.detailFrameVisible) && <span className={"link " + "add-document-btn mb-3"} onClick={props.showDetailFrame.bind(this, true)}>{props.definition.detailFrame.createNewEntryText}</span>}
        {props.detailFrameVisible &&
          <DetailFrameContainer DBObject={props.DBObject} DBObjectClass={props.DBObjectClass} setErrorMsg={props.setErrorMsg} mode={props.detailFrameMode} hideDetailFrame={props.hideDetailFrame} setDBObject={props.setDBObject} updateDBObject={props.updateDBObject} />}
        {<ListFrameContainer DBObjectClass={props.DBObjectClass} DBObject={props.DBObject} detailClickedHandler={props.detailClickedHandler} deleteItemHandler={props.deleteItemHandler} editItemHandler={props.editItemHandler} entries={props.entries} />}
        {props.saveDialogVisible &&
          <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={null} noText="Neukládat" onCancel={() => { props.setSaveDialogVisible(false) }} cancelText="Zrušit" />}
        {(props.errorMsg && props.errorMsg.length) && <ErrorDialog msg={props.errorMsg} onOk={() => { props.setErrorMsg("") }} />}
      </div>
    </>
  )
}

export default FormFrame;