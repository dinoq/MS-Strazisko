import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, DetailFrameMode } from "../../../constants/constants";
import { DBObject } from "../../../constants/types";
import ErrorDialog from "../ErrorDialog";
import DetailFrame from "./DetailFrame";

const DetailFrameContainer: FC<{DBObject: DBObject, setDBObject: Function, url: string, setErrorMsg: Function, mode:DetailFrameMode, hideObjectManager: MouseEventHandler<HTMLInputElement>}>= (props) => {
    /*
      const initFileName = "Název souboru";
      const [fileName, setFileName] = useState(initFileName);
      const [urlName, setUrlName] = useState("");
      const [fileLabel, setFileLabel] = useState("Vyberte soubor")
      const [file, setFile] = useState(null);
    
      const fileChange = (event) => {
        if (event?.target?.files[0]?.name?.length) {
          const f = event.target.files[0];
          setFile(f);
          setUrlName(f.name);
          setFileLabel("Vybráno: " + f.name);
          if (fileName === initFileName || fileName === "") {
            setFileName(f.name);
          }
        }
      }
      
      const fileNameChanged = (e) => {
        setFileName(e.target.value);
      }
    
      const clearFileName = (e) => {
        if (fileName === initFileName) {
          setFileName("");
        }
      }
      */

      console.log("props.DBObject1", props.DBObject);
    const [errorMsg, setErrorMsg] = useState("");


    const formSubmitted = async (event) => {
        event.preventDefault();
        let conditionError = false;
       /* props.headerItems.forEach((item, index, array) => {
            if(item.constraints){
                console.log('item.constraints: ', item.constraints);
                item.constraints.forEach((constraint, index, array) => {
                    let subtituted = constraint.condition.replaceAll("$", "props.DBObject.edited").replaceAll("#", item.objectParamName);
                    if(!eval(subtituted)){
                        conditionError = constraint.errorIfFail;
                    }
                })
            }
        })
        
        if(conditionError){
            setErrorMsg(conditionError);
            return;
        }
        let body: any = {};
        body = props.DBObject.edited;


        const method = (props.mode == ObjectManagerMode.EDITING_ENTRY) ? "PATCH" : "POST";
        console.log('method: ', method);
        const response = await fetch("/api/admin/" + props.url,
            {
                method,
                mode: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

        if (response.status == 200) {
            window.location.reload();
        } else {
            let text = "";
            try {
                text = await response.text();
                setErrorMsg(text);
            } catch (error) {

            }
        }*/
    };

    const updateDBObject = (objectParamName, e) => {
        props.setDBObject(prevState => {
            let edited = { ...prevState.edited };
            edited[objectParamName] = e.target.value;
            return { ...prevState, edited };
        })
    }

    console.log("props.DBObject2", props.DBObject);
    useEffect(() => {
        props.headerItems.map(((item, i) => {            
            if (item.type == ComponentType.SELECTBOX) {
                if(!props.DBObject.edited[item.objectParamName]){
                    updateDBObject(item.objectParamName, {target:{value: item.values[0]}});
                }
            }
        }))
        return () => {
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headerItems])
    console.log("props.DBObject3", props.DBObject);
    return (
        <DetailFrame />
    )
}
//"řetězec".normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-").toLowerCase() diakritika...

export default DetailFrameContainer;