import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBManager } from "../../helpers/DBManager";
import { DBObject, DBObjectAttr } from "../../helpers/types";


const initialState: DBObject = DBManager.getEmptyDBObject();

const DBObjectSlice = createSlice({
    name: "DBObject",
    initialState,
    reducers:{
        setNewEmptyDBObject(state: DBObject, action: PayloadAction<string>){
            let DBOClass = action.payload;
            let dbo = DBManager.getEmptyDBObject(DBOClass);
            return dbo;
        },
        setNewDBObject(state: DBObject, action: PayloadAction<{DBOClass: string, parentEntry: DBObject}>){
            const {DBOClass, parentEntry} = action.payload;
            let emptyObj: DBObject = DBManager.getEmptyDBObject(DBOClass);
            if (emptyObj && emptyObj.persistentAttributes && state && state.persistentAttributes && parentEntry) {
                for (const attr of emptyObj.persistentAttributes) {
                    if(attr.source){
                        const parentAttrKey = attr.source.substring(attr.source.indexOf(".") + 1, attr.source.indexOf("~"));
                        const substitutionExpresion = `@[${parentAttrKey}]`;
                        attr.value = DBManager.substituteExpression(substitutionExpresion, parentEntry);
                        //attr.value =  DBManager.substituteExpression(attr.source, parentEntry);
                    }else{
                        attr.value = DBManager.getAttrFromArrByKey(parentEntry.attributes, attr.key).value;
                    }
                }
            }
            return emptyObj;
        },

        setDBObject(state: DBObject, action: PayloadAction<DBObject>){
            const DBObj = action.payload;
            return DBObj;
        },

        setPersistentAttrs: (state: DBObject, action: PayloadAction<Array<DBObjectAttr>>)=>{
            const persistenAttrs = action.payload;
            state.persistentAttributes = persistenAttrs;
        },
        
        editDBObjectAttr(state: DBObject, action: PayloadAction<{attrKey: string, value: any}>){
            const {attrKey, value} = action.payload;            
            let editedAttrs: Array<DBObjectAttr> = state.editedAttrs || [];
            if (editedAttrs.filter(editedAttr => { return editedAttr.key == attrKey }).length) { // Klíč je již přítomný
                editedAttrs[editedAttrs.findIndex(editedAttr => editedAttr.key == attrKey)].value = value;
            } else {
                editedAttrs.push({ key: attrKey, value } as DBObjectAttr);
            }
            state.isEdited = true;
        },

        addFilesToUpload(state: DBObject, action: PayloadAction<File | File[]>){
            const files = action.payload;
            if(Array.isArray(files)){
                throw new Error("TODO addFilesToUpload ARRAY");
            }else{
                console.log('files: ', files);
                state.filesToUpload.push(files);
            }
        },
    }
})

export const {setNewEmptyDBObject, setNewDBObject, setDBObject, setPersistentAttrs, editDBObjectAttr, addFilesToUpload} = DBObjectSlice.actions;
export default DBObjectSlice.reducer;