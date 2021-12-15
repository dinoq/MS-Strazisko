// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { useState } from "react";

const FileChooser = (props) => {
    const [fileLabel, setFileLabel] = useState("Vyberte soubor")
    const [file, setFile] = useState(null);
    const initFileName = "Název souboru";
    const [fileName, setFileName] = useState(initFileName);
    const [urlName, setUrlName] = useState("");

    const fileChange = (event) => {
        if (event?.target?.files[0]?.name?.length) {
            const f = event.target.files[0];
            setFile(f);
            setUrlName(f.name);
            let label = (event.target.files.length > 1)? `Více souborů (${event.target.files.length})` : f.name;
            setFileLabel("Vybráno: " + label);
            if (fileName === initFileName || fileName === "") {
                setFileName(f.name);
            }
        }
    }

  return (
    <div className={``}>
      <input
        type="file"
        onChange={fileChange}
        name="file"
        id={props.id}
        className={"hidden-file-input"}
        multiple={true}
      />
      <div className="d-flex justify-content-center">
        <label htmlFor={props.id} className="hidden-file-input-label">
          {fileLabel}
        </label>
      </div>
    </div>
  );
};

export default FileChooser;
