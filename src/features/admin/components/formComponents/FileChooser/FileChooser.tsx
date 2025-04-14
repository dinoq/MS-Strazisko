// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { ChangeEventHandler, FC } from "react";

type FileChooserProps = { 
    id: string, 
    fileLabel: string, 
    files?: File[], 
    fileChange: ChangeEventHandler<HTMLInputElement> 
}

const FileChooser: FC<FileChooserProps> = ({ 
    id, 
    fileLabel, 
    files, 
    fileChange
}) => {

    let fileChooserDisabled = files && files.length > 0;
    return (
        <div className={``}>
            <input
                type="file"
                onChange={fileChange}
                name="file"
                id={id}
                className={"hidden-file-input"}
                multiple={true}
                disabled={fileChooserDisabled}
            />
            <div className="d-flex justify-content-center">
                <label htmlFor={id} className={"hidden-file-input-label" + (fileChooserDisabled ? " disabled" : "")}>
                    {fileLabel}
                </label>
            </div>
        </div>
    );
};

export default FileChooser;
