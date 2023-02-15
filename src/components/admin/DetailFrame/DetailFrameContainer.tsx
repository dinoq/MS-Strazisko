import { FC, MouseEventHandler } from "react";
import { useSelector } from "react-redux";
import { DetailFrameComponentType, DetailFrameMode } from "../../../helpers/constants";
import { DBManager } from "../../../helpers/DBManager";
import { editDBObjectAttr } from "../../../store/reducers/DBObjectSlice";
import { RootState } from "../../../helpers/types";
import DetailFrame from "./DetailFrame";
import { getFileComponents } from "../../../helpers/utils";
import useAppDispatch from "../../../hooks/useAppDispatch";

const DetailFrameContainer: FC<{ mode: DetailFrameMode, hideDetailFrame: MouseEventHandler<HTMLInputElement>, setErrorMsg: Function }> = (props) => {
    const formDefinition = useSelector((state: RootState) => state.formDefinitions).actualFormDefinition;
    const breadcrumbItems = useSelector((state: RootState) => state.breadcrumb.items);
    const dispatch = useAppDispatch();
    let DBOClass = useSelector((state: RootState) => state.formDefinitions.actualFormDefinition.DB?.DBOClass);
    const DBObject = useSelector((state: RootState) => state.dbObject);

    const formSubmitted = async (event) => {
        event.preventDefault();
        let conditionError = "";
        formDefinition.detailFrame.components.forEach((component, index, array) => {
            if (component.constraints) {
                component.constraints.forEach((constraint, index, array) => {
                    let subtituted = constraint.condition.replaceAll("$", "DBObject.editedAttrs[DBObject.editedAttrs.findIndex(attr=>attr.key=='" + component.attributeKey + "')].value");
                    if (!eval(subtituted)) {
                        conditionError = constraint.errMsgIfFail;
                    }
                })
            }
        })

        if (conditionError) {
            props.setErrorMsg(conditionError);
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
        if (props.mode == DetailFrameMode.NEW_ENTRY) { // set default values for selectboxes...
            formDefinition.detailFrame.components.forEach(component => {
                if (component.componentType == DetailFrameComponentType.SelectBox && body.attributes[component.attributeKey] == undefined) {
                    body.attributes[component.attributeKey] = component.values?.[0]; // set only body, not DBObject.editedAttrs!
                }
            })
        }

        /*
        if(breadcrumbItems.length && breadcrumbItems[breadcrumbItems.length - 1].parentAttribute){
            const parentAttribute = breadcrumbItems[breadcrumbItems.length - 1].parentAttribute;
            body.attributes[parentAttribute.key] = parentAttribute.value;
        }*/


        let resultErr = "";
        let afterSaveMethod = formDefinition.detailFrame.afterSaveMethod;
        if (props.mode == DetailFrameMode.EDITING_ENTRY) {
            body["updateId"] = DBObject.id;
            body["primaryKey"] = DBObject.attributes[0].key;
            resultErr = await DBManager.updateInDB(body, (!afterSaveMethod && !DBObject.filesToUpload.length));
        } else {
            resultErr = await DBManager.insertToDB(body, (!afterSaveMethod && !DBObject.filesToUpload.length));
        }

        if ((!resultErr || !resultErr.length) && DBObject.filesToUpload.length) {
            let notSubstitutedPathComponent = formDefinition.detailFrame.components.find(c => c.componentSpecificProps?.path)
            const path = DBManager.substituteExpression(notSubstitutedPathComponent?.componentSpecificProps?.path, DBObject);

            if (DBObject.filesToUpload.length > 1) {
                throw new Error("multiple files not implemented! Bude potreba vymyslet cesty...Asi by se měly do parametru filename nějak ukládat všechny nazvy souborů...")
            }
            resultErr = await DBManager.sendFiles(DBObject.filesToUpload, path);

            if (props.mode == DetailFrameMode.EDITING_ENTRY) {
                let fileComponents = getFileComponents(formDefinition.listFrame);
                if (fileComponents.length) {
                    let evaluated = DBManager.substituteExpression(fileComponents[0].transformation, DBObject, true);
                    resultErr = await DBManager.runServerMethod("deleteFile", [evaluated]);
                }
            }

        }

        if (resultErr && typeof resultErr == "string" && resultErr.length) {
            if (resultErr.includes("UNIQUE constraint failed") && formDefinition?.detailFrame?.uniqueConstraintFailed?.length) {
                props.setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
            } else {
                props.setErrorMsg(resultErr);
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
                        props.setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
                    } else {
                        props.setErrorMsg(resultErr);
                    }
                }

            }
            props.hideDetailFrame(undefined);

        }
    };

    const updateDBObject = (attrKey, value) => {
        dispatch(editDBObjectAttr({ attrKey, value }));
    }

    return (
        <DetailFrame DBObject={DBObject} definition={formDefinition} mode={props.mode} hideDetailFrame={props.hideDetailFrame} formSubmitted={formSubmitted} setErrorMsg={props.setErrorMsg} updateDBObject={updateDBObject} />
    )
}

export default DetailFrameContainer;