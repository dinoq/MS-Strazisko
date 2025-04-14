import { ListFrameComponentType } from "./constants";
import { LFComponentDef, ListFrameDef } from "./types";

var os = require("os");
var hostname = os.hostname();

const getEnvDomain = () => {
    let url = "";
    const production = process.env.NODE_ENV === 'production';
    console.log('production: ', production);
    if(hostname){ // server is asking
        console.log('hostname: ', hostname);
        if(hostname.includes("ms-strazisko")){// production
            const protocol = (production)? "https" : "https";
            url = protocol + "://admin.ms-strazisko.cz";
        }else{ // localhost
            url = "http://localhost:3000";
        }
    }else{
        console.log("Hostname not defined!");
    }
    const defaultPort = 3000;
    //return (dev ? 'http://localhost:' + (process.env.APP_PORT || defaultPort) : 'http://localhost:' + (process.env.APP_PORT || defaultPort))/*'https://your_deployment.server.com')*/;
    return url;
}

export const getApiURL = (url: string) => {
    let urlWithoutSlash = url.startsWith("/")? url.substring(1) : url;
    let apiUrl = getEnvDomain() + "/api/" + urlWithoutSlash;
    return apiUrl;
}

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


export const getFileComponents = (LFDefinition: ListFrameDef): LFComponentDef[] => {
    let fileComponents: Array<LFComponentDef> = [];

    for(const c of LFDefinition.components){
        if(c.componentType == ListFrameComponentType.ImagePreview){
            fileComponents.push(c);
        }
    }
    return fileComponents;
}