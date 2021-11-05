import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBManager } from "../../src/DBManager";
import { FormDef, FormDefinitionsState, FormDefs } from "../../src/types";

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

const defSlice = createSlice({
    name: "defSlice",
    initialState,
    reducers:{
        loadFormDef(state, action: PayloadAction<FormDefs>){
            console.log("LOADED should be only one");
            state.definitions = action.payload;
            state.definitionsLoaded = true;
        },
        setActualFormDef(state, action: PayloadAction<string>){
            console.log('action.payload: ', action.payload);
            state.actualFormDefinition = state.definitions[action.payload];
        }
    }
})

export const { loadFormDef, setActualFormDef } = defSlice.actions;
export default defSlice.reducer;