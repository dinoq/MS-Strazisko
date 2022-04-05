import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBManager } from "../../helpers/DBManager";
import { FormDef, FormDefinitionsState, FormDefs } from "../../helpers/types";
import { XMLParser } from "../../helpers/XMLParser";

let initialState: FormDefinitionsState = {
    actualFormDefinition: XMLParser.createFullDef(XMLParser._defaultDefinition, {
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
        loadFormDef(state: FormDefinitionsState, action: PayloadAction<FormDefs>){
            state.definitions = action.payload;
            state.definitionsLoaded = true;
        },
        setActualFormDef(state: FormDefinitionsState, action: PayloadAction<string>){
            state.actualFormDefinition = state.definitions[action.payload];
        }
    }
})

export const { loadFormDef, setActualFormDef } = defSlice.actions;
export default defSlice.reducer;