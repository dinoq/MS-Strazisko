import { FC, MouseEventHandler, useState } from "react";
import { useSelector } from "react-redux";
import { DetailFrameComponentType, DetailFrameMode } from "../../../helpers/constants";
import { DBManager } from "../../../helpers/DBManager";
import { editDBObjectAttr } from "../../../store/reducers/DBObjectSlice";
import { RootState } from "../../../helpers/types";
import DetailFrame from "./DetailFrame";
import { getFileComponents } from "../../../helpers/utils";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { selectActualDBOClass, selectActualFormDefinition } from "../../../store/formDefReducer/selector";

type DetailFrameContainerProps = { 
    mode: DetailFrameMode, 
    hideDetailFrame: MouseEventHandler<HTMLInputElement>, 
    setErrorMsg: Function 
}

const DetailFrameContainer: FC<DetailFrameContainerProps> = ({ 
    mode, 
    hideDetailFrame, 
    setErrorMsg
}) => {
    const dispatch = useAppDispatch();
    const formDefinition = useSelector((state: RootState) => selectActualFormDefinition(state));
    let DBOClass = useSelector((state: RootState) => selectActualDBOClass(state));
    const DBObject = useSelector((state: RootState) => state.dbObject);

    
    const [filesToUpload, setFilesToUpload] = useState<File[] | undefined>(undefined);

    const formSubmitted = async (event) => {
        event.preventDefault();
        let conditionError = "";
        formDefinition.detailFrame.components.forEach((component) => {
            if (component.constraints) {
                component.constraints.forEach((constraint) => {
                    let subtituted = constraint.condition.replaceAll("$", "DBObject.editedAttrs[DBObject.editedAttrs.findIndex(attr=>attr.key=='" + component.attributeKey + "')].value");
                    if (!eval(subtituted)) {
                        conditionError = constraint.errMsgIfFail;
                    }
                })
            }
        })

        if (conditionError) {
            setErrorMsg(conditionError);
            return;
        }
        let body: any = { className: DBOClass, attributes: {} };
        DBObject.editedAttrs.forEach((attr, index, array) => {
            body.attributes[attr.key] = attr.value;
        })

        DBObject.persistentAttributes.forEach((attr, index, array) => {
            if (!attr.source)
                body.attributes[attr.key] = attr.value;
        })
        if (mode == DetailFrameMode.NEW_ENTRY) { // set default values for selectboxes...
            formDefinition.detailFrame.components.forEach(component => {
                if (component.componentType == DetailFrameComponentType.SelectBox && body.attributes[component.attributeKey] == undefined) {
                    body.attributes[component.attributeKey] = component.values?.[0]; // set only body, not DBObject.editedAttrs!
                }
            })
        }

        let resultErr = "";
        let afterSaveMethod = formDefinition.detailFrame.afterSaveMethod;
        if (mode == DetailFrameMode.EDITING_ENTRY) {
            body["updateId"] = DBObject.id;
            body["primaryKey"] = DBObject.attributes[0].key;
            resultErr = await DBManager.updateInDB(body, (!afterSaveMethod && !filesToUpload.length));
        } else {
            resultErr = await DBManager.insertToDB(body, (!afterSaveMethod && !filesToUpload.length));
        }

        if (!resultErr && filesToUpload.length) {
            let notSubstitutedPathComponent = formDefinition.detailFrame.components.find(c => c.componentSpecificProps?.path)
            const path = DBManager.substituteExpression(notSubstitutedPathComponent?.componentSpecificProps?.path, DBObject);

            resultErr = await DBManager.sendFiles(filesToUpload, path);

            if (mode == DetailFrameMode.EDITING_ENTRY) {
                console.error("TODO - zřejmě odkomentovat následující čast, příp. dořešit");
                throw new Error("TODO - zřejmě odkomentovat následující čast, příp. dořešit");
                /*let fileComponents = getFileComponents(formDefinition.listFrame);
                if (fileComponents.length) {
                    let evaluated = DBManager.substituteExpression(fileComponents[0].transformation, DBObject, true);
                    resultErr = await DBManager.runServerMethod("deleteFile", [evaluated]);
                }*/
            }

        }

        if (resultErr) {
            if (resultErr.includes("UNIQUE constraint failed") && formDefinition?.detailFrame?.uniqueConstraintFailed?.length) {
                setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
            } else {
                setErrorMsg(resultErr);
            }
        } else if (!resultErr) {
            if (afterSaveMethod) {
                let methodName = afterSaveMethod.substring(0, afterSaveMethod.indexOf("("));

                let rawParams = (afterSaveMethod.substring(methodName.length + 1, afterSaveMethod.length - 1)).split(",");
                let params: Array<string> = [];
                for (const rawParam of rawParams) {
                    let evaluated = DBManager.substituteExpression(rawParam, DBObject);
                    params.push(evaluated);
                }

                resultErr = await DBManager.runServerMethod(methodName, params);

                if (resultErr && typeof resultErr == "string" && resultErr.length) {
                    if (resultErr.includes("UNIQUE constraint failed")) {
                        setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
                    } else {
                        setErrorMsg(resultErr);
                    }
                }

            }
            hideDetailFrame(undefined);

        }
    };

    const updateDBObject = (attrKey, value) => {
        dispatch(editDBObjectAttr({ attrKey, value }));
    }

    return (
        <DetailFrame DBObject={DBObject} definition={formDefinition} mode={mode} hideDetailFrame={hideDetailFrame} formSubmitted={formSubmitted} setErrorMsg={setErrorMsg} updateDBObject={updateDBObject} filesToUpload={filesToUpload} setFilesToUpload={setFilesToUpload} />
    )
}

export default DetailFrameContainer;