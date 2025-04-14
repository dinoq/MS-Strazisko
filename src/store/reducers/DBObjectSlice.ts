import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBManager } from "../../features/data/lib/DBManager";
import { DBObjectType, DBObjectAttr, DBOClassType, BreadcrumbItemDef } from "../../FilesToDistribute/types";
import { breadcrumbItemSelected } from "./BreadcrumbSlice";


const initialState: DBObjectType = DBManager.getEmptyDBObject(undefined);

const DBObjectSlice = createSlice({
    name: "DBObject",
    initialState,
    reducers: {
        setNewEmptyDBObject(state: DBObjectType, action: PayloadAction<string>) {
            let DBOClass = action.payload;
            let dbo = DBManager.getEmptyDBObject(DBOClass);
            return dbo;
        },
        setNewDBObject(state: DBObjectType, action: PayloadAction<{ DBOClass: DBOClassType, parentEntry: DBObjectType | undefined }>) {
            const { DBOClass, parentEntry } = action.payload;
            let emptyObj: DBObjectType = DBManager.getEmptyDBObject(DBOClass);
            if (emptyObj && emptyObj.persistentAttributes && state && state.persistentAttributes && parentEntry) {
                for (const attr of emptyObj.persistentAttributes) {
                    if (parentEntry == undefined)
                        continue;
                    if (attr.source) {
                        const parentAttrKey = attr.source.substring(attr.source.indexOf(".") + 1, attr.source.indexOf("~"));
                        const substitutionExpresion = `@[${parentAttrKey}]`;
                        attr.value = DBManager.substituteExpression(substitutionExpresion, parentEntry);
                        //attr.value =  DBManager.substituteExpression(attr.source, parentEntry);
                    } else {
                        attr.value = DBManager.getAttrFromArrByKey(parentEntry.attributes, attr.key).value;
                    }
                }
            }
            return emptyObj;
        },

        setDBObject(state: DBObjectType, action: PayloadAction<DBObjectType>) {
            const DBObj = action.payload;
            return DBObj;
        },

        setEditedAttrs(state: DBObjectType, action: PayloadAction<Array<DBObjectAttr>>) {
            const dBObjectEditedAttrs = action.payload;
            state.editedAttrs = dBObjectEditedAttrs;
        },

        setPersistentAttrs: (state: DBObjectType, action: PayloadAction<Array<DBObjectAttr>>) => {
            const persistenAttrs = action.payload;
            state.persistentAttributes = persistenAttrs;
        },

        editDBObjectAttr(state: DBObjectType, action: PayloadAction<{ attrKey: string, value: any }>) {
            const { attrKey, value } = action.payload;
            let editedAttrs: Array<DBObjectAttr> = state.editedAttrs || [];
            if (editedAttrs.filter(editedAttr => { return editedAttr.key == attrKey }).length) { // Klíč je již přítomný
                editedAttrs[editedAttrs.findIndex(editedAttr => editedAttr.key == attrKey)].value = value;
            } else {
                editedAttrs.push({ key: attrKey, value } as DBObjectAttr);
            }
            state.isEdited = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(breadcrumbItemSelected, (state: DBObjectType, action: PayloadAction<{ index: number, items: Array<BreadcrumbItemDef> }>) => {
                const { items, index } = action.payload;
                const DBObj = items[index].DBObject;
                console.log('DBObj: ', DBObj);
                return DBObj;
            })

    },
})

export const { setNewEmptyDBObject, setNewDBObject, setDBObject, setEditedAttrs, setPersistentAttrs, editDBObjectAttr } = DBObjectSlice.actions;
export default DBObjectSlice.reducer;