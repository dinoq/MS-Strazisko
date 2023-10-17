import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DBManager } from "../../helpers/DBManager";
import { FormDef, FormDefinitionsState, FormDefs } from "../../helpers/types";
import { XMLParser } from "../../helpers/XMLParser";
import { breadcrumbItemSelected } from "../reducers/BreadcrumbSlice";
import { SagaActions } from "../sagas";

let initialState: FormDefinitionsState = {
    actualFormDefinition: "",
    definitions: {},
    definitionsLoaded: false
}

const sag = createAction(SagaActions.SET_FORM_DEFINITIONS);

const slice = createSlice({
    name: "FormsSlice",
    initialState,
    reducers:{
        loadFormDef(state: FormDefinitionsState, action: PayloadAction<FormDefs>){
            state.definitions = action.payload;
            state.definitionsLoaded = true;
        },
        setActualFormDef(state: FormDefinitionsState, action: PayloadAction<string>){
            state.actualFormDefinition = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sag, (state: FormDefinitionsState, action: PayloadAction<number>) => {
                console.log("AAAAAAAAAAAA JEA sag");
            })        
    },
})

export const { loadFormDef, setActualFormDef } = slice.actions;
export default slice.reducer;