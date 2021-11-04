import { createSlice } from "@reduxjs/toolkit";
import { DBManager } from "../../src/DBManager";
import { FormDef } from "../../src/types";

const initialState: FormDef = DBManager.createFullDef(DBManager._defaultDefinition, {
    detailFrame: {
        components: []
    },
    listFrame:{
        components: []
    }
});

const defSlice = createSlice({
    name: "defSlice",
    initialState,
    reducers:{
        loadDef(state, action){
            DBManager.getFormDefinition(action.payload).then(def=>{
                console.log('defddddd: ', def);
                state = def;
            })
        }
    }
})

export const { loadDef } = defSlice.actions;
export default defSlice.reducer;