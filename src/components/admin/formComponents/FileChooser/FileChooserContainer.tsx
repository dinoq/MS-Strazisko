// eslint-disable-next-line
//import classes from "./FileChooser.module.css";

import { FC, useEffect, useState } from "react";
import useAppDispatch from "../../../../hooks/useAppDispatch";
import FileChooser from "./FileChooser";

const INIT_LABEL = "Výběr fotky";

type FileChooserContainerProps = {
    id: string, 
    onChange: Function, 
    initLabel: string | undefined,
    filesToUpload: File[] | undefined,
    setFilesToUpload: Function
}

const FileChooserContainer: FC<FileChooserContainerProps> = ({
    id, 
    onChange, 
    initLabel,
    filesToUpload,
    setFilesToUpload
}) => {
    const [fileLabel, setFileLabel] = useState(initLabel || INIT_LABEL);
    const initFileName = "Název souboru";
    const [fileName, setFileName]: [any, any] = useState(initFileName);
    const [urlName, setUrlName] = useState("");
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        setFileLabel(initLabel || INIT_LABEL);    
    }, [initLabel])
    

    const fileChange = (event) => {
        let files = event?.target?.files;
        let filesCount = files?.length;
        if (filesCount) {
            if(filesCount == 1){
                const f:File = files[0];
                setFilesToUpload([f]);
                onChange(id,f.name);
                setUrlName(f.name);
                let label = (files.length > 1)? `Více souborů (${files.length})` : f.name;
                setFileLabel("Vybráno: " + label);
                if (fileName === initFileName || fileName === "") {
                    setFileName(f.name);
                }
            }else{
                setFilesToUpload(files);
                console.error("TODO multiple files")
            }
        }
    }

  return (
      <FileChooser id={id} fileLabel={fileLabel} fileChange={fileChange} files={filesToUpload}/>
  );
};

export default FileChooserContainer;
