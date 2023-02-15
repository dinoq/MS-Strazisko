// eslint-disable-next-line
//import classes from "../styles/FormFrame.module.scss";

import React, { EventHandler } from "react";
import { DetailFrameMode } from "../../../helpers/constants";
import { DBObjectType, FormDef } from "../../../helpers/types";
import BreadcrumbContainer from "../Breadcrumb/BreadcrumbContainer";
import DetailFrameContainer from "../DetailFrame/DetailFrameContainer";
import ErrorDialog from "../ErrorDialog";
import ListFrameContainer from "../ListFrame/ListFrameContainer";
import TreeChoiceDialog from "../TreeChoiceDialog";

const FormFrame: React.FC<{ errorMsg: string, detailFrameVisible: boolean, saveDialogVisible: boolean, entries: Array<DBObjectType>, detailFrameMode: DetailFrameMode, definition: FormDef, DBObject: DBObjectType, hideDetailFrame: EventHandler<any>, setDBObject: Function, editItemHandler: Function, showDetailFrame: Function, setSaveDialogVisible: Function, setErrorMsg: Function }> = (props) => {

    return (
        <>
            <BreadcrumbContainer hideDetailFrame={props.hideDetailFrame}/>

            <div className={"form-wrapper"}>
                {(props?.definition?.detailFrame?.createNewEntryText?.length !== 0 && !props.detailFrameVisible) && <span className={"link " + "add-document-btn mb-3"} onClick={props.showDetailFrame.bind(this, true)}>{props.definition.detailFrame.createNewEntryText}</span>}
                {props.detailFrameVisible &&
                    <DetailFrameContainer setErrorMsg={props.setErrorMsg} mode={props.detailFrameMode} hideDetailFrame={props.hideDetailFrame} />}
                {<ListFrameContainer editItemHandler={props.editItemHandler}  hideDetailFrame={props.hideDetailFrame}/>}
                {props.saveDialogVisible &&
                    <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={null} noText="Neukládat" onCancel={() => { props.setSaveDialogVisible(false) }} cancelText="Zrušit" />}
                {(props.errorMsg && props.errorMsg.length) && <ErrorDialog msg={props.errorMsg} onOk={() => { props.setErrorMsg("") }} />}
            </div>
        </>
    )
}

export default FormFrame;