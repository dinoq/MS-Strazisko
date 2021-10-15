// eslint-disable-next-line
//import classes from "./SaveDialog.module.css";

const SaveDialog = (props) => {
    
    return (
        <div className={`save-dialog`}>
            <div className="overlay" onClick={props.onCancel}></div>
            <div className="dialog">
                <div className="msg mb-3">Chcete změny uložit?</div>
                <div className="btns-group">
                    <div className="save-btn btn btn-secondary" onClick={props.onCancel}>Zrušit</div>
                    <div className="save-btn btn btn-secondary" onClick={props.onDontSave}>Neukládat</div>
                    <div className="save-btn btn btn-primary" onClick={props.onSave}>Uložit</div>
                </div>
            </div>
        </div>
    )
}

export default SaveDialog;