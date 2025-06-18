import { createSelector } from "@reduxjs/toolkit";
import { XMLParser } from "../../FilesToDistribute/XMLParser";
import { FormDef, RootState } from "../../FilesToDistribute/types";

const defaultFormDef: FormDef = XMLParser.createFullDef(XMLParser._defaultDefinition, {
  detailFrame: { components: [] },
  listFrame: { components: [] }
});

export const selectActualFormDefinition = (state: RootState): FormDef  => {
    let fid = Object.keys(state.forms.definitions).find(fid => fid === state.forms.actualFormDefinition)
    if(fid === undefined){
        return defaultFormDef;
    }else{
        return state.forms.definitions[fid];
    }
}

export const selectActualDBOClass = (state: RootState): string | undefined => selectActualFormDefinition(state)?.DB?.DBOClass;