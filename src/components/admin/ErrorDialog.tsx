// eslint-disable-next-line
//import classes from "./ErrorDialog.module.css";

import { EventHandler, FC } from "react";

type ErrorDialogProps = { 
    msg: string, 
    onOk: EventHandler<any> 
}

const ErrorDialog: FC<ErrorDialogProps> = ({ 
    msg, 
    onOk
}) => {
    let errorMsgs = msg.split(/(<br ?\/?>)/g).filter(msg => !msg.match(/(<br ?\/?>)/g)); // Rozdělí zprávu podle znaků <br>(příp. i <br/> a <br />)

    return (
        <div className="dialog">
            <div className="overlay"></div>
            <div className="dialog-body">
                <div className="msg p-4 mb-3 text-danger">
                    {errorMsgs.map((msg, index) => {
                        return <div key={"err-" + index}>
                            {msg}
                        </div>
                    })}
                </div>
                <div className="btns-group">
                    <div className="save-btn btn btn-primary" onClick={onOk}>OK</div>
                </div>
            </div>
        </div >
    )
}

export default ErrorDialog;