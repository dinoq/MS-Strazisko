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

type FormFrameProps = { 
    errorMsg: string, 
    detailFrameVisible: boolean, 
    saveDialogVisible: boolean, 
    entries: Array<DBObjectType>, 
    detailFrameMode: DetailFrameMode, 
    definition: FormDef, 
    DBObject: DBObjectType, 
    hideDetailFrame: EventHandler<any>, 
    setDBObject: Function, 
    editItemHandler: Function, 
    showDetailFrame: Function, 
    setSaveDialogVisible: Function, 
    setErrorMsg: Function,
    createEntryText: string
}

const FormFrame: React.FC<FormFrameProps> = ({ 
    errorMsg, 
    detailFrameVisible, 
    saveDialogVisible, 
    entries, 
    detailFrameMode, 
    definition, 
    DBObject, 
    hideDetailFrame, 
    setDBObject, 
    editItemHandler, 
    showDetailFrame, 
    setSaveDialogVisible, 
    setErrorMsg,
    createEntryText
}) => {

    return (
        <>
            <BreadcrumbContainer hideDetailFrame={hideDetailFrame}/>

            <div className={"form-wrapper"}>
                {(createEntryText.length !== 0 && !detailFrameVisible) && <span className={"link " + "add-document-btn mb-3"} onClick={showDetailFrame.bind(this, true)}>{createEntryText}</span>}
                {detailFrameVisible &&
                    <DetailFrameContainer setErrorMsg={setErrorMsg} mode={detailFrameMode} hideDetailFrame={hideDetailFrame} />}
                {<ListFrameContainer editItemHandler={editItemHandler}  hideDetailFrame={hideDetailFrame}/>}
                {saveDialogVisible &&
                    <TreeChoiceDialog dialogText="Chcete změny uložit?" overlayCancels={true} onYes={null} yesText="Uložit" onNo={null} noText="Neukládat" onCancel={() => { setSaveDialogVisible(false) }} cancelText="Zrušit" />}
                {(errorMsg && errorMsg.length) && <ErrorDialog msg={errorMsg} onOk={() => { setErrorMsg("") }} />}
            </div>
        </>
    )
}

export default FormFrame;