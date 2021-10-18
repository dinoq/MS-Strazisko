// eslint-disable-next-line
//import classes from "./ErrorDialog.module.css";

const ErrorDialog = (props) => {
    
    return (
        <div className="dialog">
            <div className="overlay"></div>
            <div className="dialog-body">
                <div className="msg mb-3">{props.msg}</div>
                <div className="btns-group">
                    <div className="save-btn btn btn-primary" onClick={props.onOk}>OK</div>
                </div>
            </div>
        </div>
    )
}

export default ErrorDialog;