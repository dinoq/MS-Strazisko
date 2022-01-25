// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { ComponentType } from "../../../../constants";
import { addFilesToUpload } from "../../../../store/reducers/DBObjectReducer";
import FileChooser from "./FileChooser";

const FileChooserContainer: FC<{id: string, onChange: Function}> = (props) => {
    const [fileLabel, setFileLabel] = useState("Vyberte soubor")
    const [file, setFile] = useState(null);
    const initFileName = "Název souboru";
    const [fileName, setFileName] = useState(initFileName);
    const [urlName, setUrlName] = useState("");
    const dispatch = useDispatch();
    
    const fileChange = (event) => {
        if (event?.target?.files[0]?.name?.length) {
            console.log('fileChange event: ', event);
            const f:File = event.target.files[0];
            setFile(f);
            dispatch(addFilesToUpload(f));
            props.onChange(props.id,f.name);
            setUrlName(f.name);
            let label = (event.target.files.length > 1)? `Více souborů (${event.target.files.length})` : f.name;
            setFileLabel("Vybráno: " + label);
            if (fileName === initFileName || fileName === "") {
                setFileName(f.name);
            }
        }
    }

  return (
      <FileChooser id={props.id} fileLabel={fileLabel} fileChange={fileChange}/>
  );
};

export default FileChooserContainer;
