import { DetailFrameComponentType, ListFrameComponentType } from "./constants";
import { DetailFrameDef, DFComponentDef, LFComponentDef, ListFrameDef } from "./types";


/**
 * Kontrola, zda jde o validní formát názvu db třídy. Příp. je možné použít na kontrolu i jiných věcí. Vrací true, pokud předaný název (/názvy) obsahuje pouze písmena/čísla/podtržítko, či se jedná o undefined nebo prázdný řetězec (TODO opravdu undefined a prázdný řetězec má vyhovovat...?)
 * @param words Název nebo pole názvů ke kontrole
 * @returns True pokud se jedná o validní formát názvu db třídy
 */
export const isValidClassName = (words: string | Array<string>) => {
    const check = (w)=>{
        const word = (typeof w == "number")? (w as number).toString() : w;
        return word == undefined || typeof word == "string" && (word.match(/^[A-Za-z_/0-9]*$/) || word.length == 0);
    }
    if(Array.isArray(words)){
        let error = false;
        words.forEach(word=>{
            if(!check(word)){
                console.log('word fail: ', word);
                error = true;
            }
        })
        return !error;
    }else{
        const word = words;
        return check(word)
    }
};

export const checkIfNotDangerSQL = (words: string | Array<string>) => {
    if(Array.isArray(words)){
        let error = false;
        words.forEach(word=>{
            if(!(typeof word == "string" && !word.includes(";") && !word.toLowerCase().includes("delete"))){
                error = true;
            }
        })
        return !error;
    }else{
        return typeof words == "string" && !words.includes(";") && !words.toLowerCase().includes("delete");
    }
};


export const getFileComponents = (LFDefinition: DetailFrameDef): DFComponentDef[] => {
    let fileComponents: Array<DFComponentDef> = [];

    for(const c of LFDefinition.components){
        if(c.componentType == DetailFrameComponentType.FileChooser){
            fileComponents.push(c);
        }
    }
    return fileComponents;
}