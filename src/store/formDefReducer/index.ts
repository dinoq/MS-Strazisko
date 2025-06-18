"use client"
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormDefinitionsState, FormDefs } from "../../FilesToDistribute/types";
import { SagaActions } from "@store/sagaActions";

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
    }
})

export const { loadFormDef, setActualFormDef } = slice.actions;
export default slice.reducer;