import { XMLParser } from "../../helpers/XMLParser";
import { FormDef, RootState } from "../../helpers/types";

export const selectActualFormDefinition = (state: RootState): FormDef  => {
    let fid = Object.keys(state.forms.definitions).find(fid => fid === state.forms.actualFormDefinition)
    if(fid === undefined){
        return XMLParser.createFullDef(XMLParser._defaultDefinition, {
            detailFrame: {
                components: []
            },
            listFrame:{
                components: []
            }
        })
    }else{
        return state.forms.definitions[fid];
    }
}
export const selectActualDBOClass = (state: RootState): string => selectActualFormDefinition(state)?.DB?.DBOClass;