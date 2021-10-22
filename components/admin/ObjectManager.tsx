import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { ComponentType, ObjectManagerMode } from "../../constants/constants";
import { DBObject } from "../../constants/types";
import ErrorDialog from "./ErrorDialog";

const ObjectManager: FC<{DBObject: DBObject, setDBObject: Function, url: string, setErrorMsg: Function, mode:ObjectManagerMode, hideObjectManager: MouseEventHandler<HTMLInputElement>}>= (props) => {
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
        <div>
            <form className="d-flex flex-column bordered p-2 mb-3" onSubmit={formSubmitted}>
                {props.headerItems.map(((item, i) => {
                    if (item.editable) {
                        if (item.type == ComponentType.INPUT) {
                            return (
                                <div key={"input-" + i}>
                                    <div className="d-flex justify-content-center">
                                        <input type={item.inputType ? item.inputType : "text"} id={item.id ? item.id : ""} placeholder={item.content} value={(props.DBObject.editedAttrs[item.objectParamName])?props.DBObject.editedAttrs[item.objectParamName]:props.DBObject.attrs[item.objectParamName]} onChange={updateDBObject.bind(this, item.objectParamName)} required/>
                                    </div>
                                </div>
                            );
                        } else if (item.type == ComponentType.SELECTBOX) {
                            if (props.mode == ObjectManagerMode.EDITING_ENTRY) {
                                return (
                                    <select key={"selectbox-" + i} id={item.id ? item.id : ""} value={(props.DBObject.editedAttrs[item.objectParamName])?props.DBObject.editedAttrs[item.objectParamName]:props.DBObject.attrs[item.objectParamName]} onChange={updateDBObject.bind(this, item.objectParamName)} disabled={!item.editableInEditMode}>
                                        {item.values.map((val, j) => {
                                            return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                        })}
                                    </select>
                                );
                            } else {
                                return (
                                    <select key={"selectbox-" + i} id={item.id ? item.id : ""} value={(props.DBObject.editedAttrs[item.objectParamName])?props.DBObject.editedAttrs[item.objectParamName]:props.DBObject.attrs[item.objectParamName]} onChange={updateDBObject.bind(this, item.objectParamName)}>
                                        {item.values.map((val, j) => {
                                            return <option key={"selectbox-" + i + "-option-" + j} value={val}>{val}</option>
                                        })}
                                    </select>
                                );
                            }
                        } else {
                            return (
                                <div key={"component-" + i}>

                                </div>
                            );
                        }
                    }
                }))}

                <div className="d-flex justify-content-center">
                    <input className="button" type="submit" value="Uložit" />
                    <input className="button button-danger" onClick={props.hideObjectManager} type="button" value="Zrušit" />
                </div>
            </form>
            {(errorMsg && errorMsg.length) && <ErrorDialog msg={errorMsg} onOk={() => { setErrorMsg("") }} />}
        </div>
    )
}
//"řetězec".normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-").toLowerCase() diakritika...

export default ObjectManager;