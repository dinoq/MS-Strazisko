import { createSlice } from "@reduxjs/toolkit";
import { DBManager } from "../../src/DBManager";
import { FormDef, FormDefinitionsState, FormDefs } from "../../src/types";

/*
const initialState: FormDef = DBManager.createFullDef(DBManager._defaultDefinition, {
    detailFrame: {
        components: []
    },
    listFrame:{
        components: []
    }
});*/

let initialState: FormDefinitionsState = {
    actualFormDefinition: DBManager.createFullDef(DBManager._defaultDefinition, {
        detailFrame: {
            components: []
        },
        listFrame:{
            components: []
        }
    }),
    definitions: {},
    definitionsLoaded: false
}
console.log('initialState: ', initialState);

const defSlice = createSlice({
    name: "defSlice",
    initialState,
    reducers:{
        loadFormDef(state, action){
            state.definitions = action.payload.def;
            state.definitionsLoaded = true;
        },
        setActualFormDef(state, action){
            console.log('action.payload: ', action.payload);
            state.actualFormDefinition = state.definitions[action.payload];
        }
    }
})

export const { loadFormDef, setActualFormDef } = defSlice.actions;
export default defSlice.reducer;