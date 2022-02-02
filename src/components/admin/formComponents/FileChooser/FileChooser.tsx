// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { ChangeEventHandler, FC, FormEventHandler, MouseEventHandler, useState } from "react";
import { DetailFrameMode } from "../../../../helpers/constants";
import { DBObject, FormDef } from "../../../../helpers/types";

const FileChooser: FC<{ id: string, fileLabel: string,fileChange: ChangeEventHandler<HTMLInputElement> }> = (props) => {
  return (
    <div className={``}>
      <input
        type="file"
        onChange={props.fileChange}
        name="file"
        id={props.id}
        className={"hidden-file-input"}
        multiple={true}
      />
      <div className="d-flex justify-content-center">
        <label htmlFor={props.id} className="hidden-file-input-label">
          {props.fileLabel}
        </label>
      </div>
    </div>
  );
};

export default FileChooser;
