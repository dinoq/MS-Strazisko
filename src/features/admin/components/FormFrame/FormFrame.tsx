import React, { EventHandler } from "react";
import { DetailFrameMode } from "../../../../FilesToDistribute/constants";
import { DBObjectType, FormDef } from "../../../../FilesToDistribute/types";
import BreadcrumbContainer from "../Breadcrumb/BreadcrumbContainer";
import DetailFrameContainer from "../DetailFrame/DetailFrameContainer";
import ErrorDialog from "../Dialogs/ErrorDialog";
import ListFrameContainer from "../ListFrame/ListFrameContainer";
import TreeChoiceDialog from "../Dialogs/TreeChoiceDialog";

type FormFrameProps = { 
    errorMsg: string, 
    detailFrameVisible: boolean, 
    saveDialogVisible: boolean, 
    entries: Array<DBObjectType>, 
    detailFrameMode: DetailFrameMode, 
    definition: FormDef, 
    DBObject: DBObjectType, 
    hideDetailFrame: () => void, 
    setDBObject: Function, 
    editItemHandler: Function, 
    showDetailFrame: Function, 
    setSaveDialogVisible: Function, 
    setErrorMsg: Function,
    createEntryText?: string
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
                {(!detailFrameVisible) && <span className={"link " + "add-document-btn mb-3"} onClick={showDetailFrame.bind(this, true)}>{createEntryText || "Přidat záznam"}</span>}
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