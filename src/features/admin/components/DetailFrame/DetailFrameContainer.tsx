'use client';

import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    DetailFrameComponentType,
    DetailFrameMode,
} from '../../../../FilesToDistribute/constants';
import { DBManager } from '../../../data/lib/DBManager';
import { editDBObjectAttr } from '../../../../store/reducers/DBObjectSlice';
import { RootState } from '../../../../FilesToDistribute/types';
import DetailFrame from './DetailFrame';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import {
    selectActualDBOClass,
    selectActualFormDefinition,
} from '../../../../store/formDefReducer/selector';
import { ServerResponse } from '@features/data/lib/types';
import { getFileComponents } from 'FilesToDistribute/utils';

type DetailFrameContainerProps = {
    mode: DetailFrameMode;
    hideDetailFrame: () => void;
    setErrorMsg: Function;
};

const DetailFrameContainer: FC<DetailFrameContainerProps> = ({
    mode,
    hideDetailFrame,
    setErrorMsg,
}) => {
    const dispatch = useAppDispatch();
    const formDefinition = useSelector((state: RootState) =>
        selectActualFormDefinition(state)
    );
    let DBOClass = useSelector((state: RootState) =>
        selectActualDBOClass(state)
    );
    const DBObject = useSelector((state: RootState) => state.dbObject);

    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

    const formSubmitted = async (event) => {
        event.preventDefault();
        let conditionError = '';
        formDefinition.detailFrame.components.forEach((component) => {
            if (component.constraints) {
                component.constraints.forEach((constraint) => {
                    let subtituted = constraint.condition.replaceAll(
                        '$',
                        "DBObject.editedAttrs[DBObject.editedAttrs.findIndex(attr=>attr.key=='" +
                            component.attributeKey +
                            "')].value"
                    );
                    if (!eval(subtituted)) {
                        conditionError = constraint.errMsgIfFail;
                    }
                });
            }
        });

        if (conditionError) {
            setErrorMsg(conditionError);
            return;
        }
        let body: any = { className: DBOClass, attributes: {} };
        DBObject.editedAttrs.forEach((attr, index, array) => {
            body.attributes[attr.key] = attr.value;
        });

        DBObject.persistentAttributes.forEach((attr, index, array) => {
            if (!attr.source) body.attributes[attr.key] = attr.value;
        });
        if (mode == DetailFrameMode.NEW_ENTRY) {
            // set default values for selectboxes...
            formDefinition.detailFrame.components.forEach((component) => {
                if (
                    component.componentType ==
                        DetailFrameComponentType.SelectBox &&
                    body.attributes[component.attributeKey] == undefined
                ) {
                    body.attributes[component.attributeKey] =
                        component.values?.[0]; // set only body, not DBObject.editedAttrs!
                }
            });
        }

        let result: ServerResponse;
        let afterSaveMethod = formDefinition.detailFrame.afterSaveMethod;
        if (mode == DetailFrameMode.EDITING_ENTRY) {
            body['updateId'] = DBObject.id;
            body['primaryKey'] = DBObject.attributes[0].key;
            result = await DBManager.updateInDB(
                body,
                !afterSaveMethod && !filesToUpload.length
            );
        } else {
            result = await DBManager.insertToDB(
                body,
                !afterSaveMethod && !filesToUpload.length
            );
        }

        if (result?.type !== 'error' && filesToUpload.length) {
            let fileComponents = getFileComponents(formDefinition.detailFrame);
            let oldPath = DBManager.substituteExpression(
                fileComponents[0].componentSpecificProps?.path,
                DBObject,
                true
            );
            let newPath = DBManager.substituteExpression(
                fileComponents[0].componentSpecificProps?.path,
                DBObject,
                false
            );

            result = await DBManager.sendFiles(filesToUpload, newPath);

            if (mode == DetailFrameMode.EDITING_ENTRY) {
                result = await DBManager.runServerMethod('deleteFile', [oldPath]);
            }
        }

        if (!(result?.type === 'information')) {
            // TODO vrátí se skutečně unique constraint failed? po změné na prisma? a porovnávat skutešně message nebo data?
            if (
                result.message.includes('UNIQUE constraint failed') &&
                formDefinition?.detailFrame?.uniqueConstraintFailed?.length
            ) {
                setErrorMsg(formDefinition.detailFrame.uniqueConstraintFailed);
            } else {
                setErrorMsg(result.message); // Todo vypisovat message nebo data?
            }
        } else if (result.type === 'information') {
            if (afterSaveMethod) {
                let methodName = afterSaveMethod.substring(
                    0,
                    afterSaveMethod.indexOf(';')
                );

                let rawParams = afterSaveMethod.split(';').slice(1);
                let params: Array<string> = [];
                for (const rawParam of rawParams) {
                    let evaluated = DBManager.substituteExpression(
                        rawParam,
                        DBObject
                    );
                    params.push(evaluated);
                }

                result = await DBManager.runServerMethod(methodName, params);

                if (result?.type === 'error' && result?.message) {
                    // todo kontrolovat message nebo data?
                    if (result.message.includes('UNIQUE constraint failed')) {
                        // TODO vrátí se skutečně unique constraint failed? po změné na prisma? a porovnávat skutešně message nebo data?
                        setErrorMsg(
                            formDefinition.detailFrame.uniqueConstraintFailed
                        );
                    } else {
                        setErrorMsg(result.message); // Todo vypisovat message nebo data?
                    }
                }
            }
            hideDetailFrame();
        }
    };

    const updateDBObject = (attrKey, value) => {
        dispatch(editDBObjectAttr({ attrKey, value }));
    };

    return (
        <DetailFrame
            DBObject={DBObject}
            definition={formDefinition}
            mode={mode}
            hideDetailFrame={hideDetailFrame}
            formSubmitted={formSubmitted}
            setErrorMsg={setErrorMsg}
            updateDBObject={updateDBObject}
            filesToUpload={filesToUpload}
            setFilesToUpload={setFilesToUpload}
        />
    );
};

export default DetailFrameContainer;
