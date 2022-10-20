// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { FC, useState } from "react";
import { useAppDispatch } from "../../../../hooks";
import { addFilesToUpload } from "../../../../store/reducers/DBObjectSlice";
import FileChooser from "./FileChooser";

const FileChooserContainer: FC<{id: string, onChange: Function, initLabel: string | undefined}> = (props) => {
    const [fileLabel, setFileLabel] = useState(props.initLabel ?? "");
    const [files, setFiles] = useState<File[] | undefined>(undefined);
    const initFileName = "Název souboru";
    const [fileName, setFileName]: [any, any] = useState(initFileName);
    const [urlName, setUrlName] = useState("");
    const dispatch = useAppDispatch();
    
    const fileChange = (event) => {
        let files = event?.target?.files;
        console.log('files: ', files);
        let filesCount = files?.length;
        console.log('filesCount: ', filesCount);
        if (filesCount) {
            console.log('filesCount: ', filesCount);
            if(filesCount == 1){
                const f:File = files[0];
                setFiles([f]);
                dispatch(addFilesToUpload(f));
                props.onChange(props.id,f.name);
                setUrlName(f.name);
                let label = (files.length > 1)? `Více souborů (${files.length})` : f.name;
                setFileLabel("Vybráno: " + label);
                if (fileName === initFileName || fileName === "") {
                    setFileName(f.name);
                }
            }else{
                console.log('Array.isArray(files): ', Array.isArray(Array.from(files)));
                console.log('files: ', files);
                console.log('Array.from(files): ', Array.from(files));
            }
        }
    }

  return (
      <FileChooser id={props.id} fileLabel={fileLabel} fileChange={fileChange} files={files}/>
  );
};

export default FileChooserContainer;
