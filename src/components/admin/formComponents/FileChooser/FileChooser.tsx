// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { ChangeEventHandler, FC, FormEventHandler, MouseEventHandler, useState } from "react";
import { DetailFrameMode } from "../../../../helpers/constants";
import { DBObjectType, FormDef } from "../../../../helpers/types";

const FileChooser: FC<{ id: string, fileLabel: string, files: File[], fileChange: ChangeEventHandler<HTMLInputElement> }> = (props) => {

    let fileChooserDisabled = props.files && props.files.length > 0;
    return (
        <div className={``}>
            <input
                type="file"
                onChange={props.fileChange}
                name="file"
                id={props.id}
                className={"hidden-file-input"}
                multiple={true}
                disabled={fileChooserDisabled}
            />
            <div className="d-flex justify-content-center">
                <label htmlFor={props.id} className={"hidden-file-input-label" + (fileChooserDisabled ? " disabled" : "")}>
                    {props.fileLabel}
                </label>
            </div>
        </div>
    );
};

export default FileChooser;
