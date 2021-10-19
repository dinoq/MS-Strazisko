// eslint-disable-next-line
//import classes from "./SaveDialog.module.css";

import { FC } from "react";

const TreeChoiceDialog: FC<{ dialogText: string, cancelText: string, onCancel: any, yesText: string, onYes: any, noText: string, onNo: any, overlayCancels: boolean }> = (props) => {

    return (
        <div className="dialog">
            <div className={"overlay" + (props.overlayCancels? " cursor-pointer" : "")} onClick={props.overlayCancels ? props.onCancel : undefined}></div>
            <div className="dialog-body">
                <div className="msg mb-3">{props.dialogText}</div>
                <div className="btns-group">
                    {props.cancelText && <div className="save-btn btn btn-secondary" onClick={props.onCancel}>{props.cancelText}</div>}
                    <div className="save-btn btn btn-secondary" onClick={props.onNo}>{props.noText}</div>
                    <div className="save-btn btn btn-primary" onClick={props.onYes}>{props.yesText}</div>
                </div>
            </div>
        </div>
    )
}

export default TreeChoiceDialog;