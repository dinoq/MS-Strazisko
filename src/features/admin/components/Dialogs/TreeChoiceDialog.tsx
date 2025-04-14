// eslint-disable-next-line
//import classes from "./SaveDialog.module.css";

import { FC } from "react";
type TreeChoiceDialogProps = { 
    dialogText: string	
    cancelText: string
    onCancel: any
    yesText: string
	onYes: any
	noText: string
	onNo: any
	overlayCancels: boolean 
}

const TreeChoiceDialog: FC<TreeChoiceDialogProps> = ({ 
    dialogText,
    cancelText,
    onCancel,
    yesText,
	onYes,
	noText,
	onNo,
	overlayCancels,
}) => {

    return (
        <div className="dialog">
            <div className={"overlay" + (overlayCancels? " cursor-pointer" : "")} onClick={overlayCancels ? onCancel : undefined}></div>
            <div className="dialog-body">
                <div className="msg mb-3">{dialogText}</div>
                <div className="btns-group">
                    {cancelText && <div className="save-btn btn btn-secondary" onClick={onCancel}>{cancelText}</div>}
                    <div className="save-btn btn btn-secondary" onClick={onNo}>{noText}</div>
                    <div className="save-btn btn btn-primary" onClick={onYes}>{yesText}</div>
                </div>
            </div>
        </div>
    )
}

export default TreeChoiceDialog;