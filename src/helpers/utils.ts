var os = require("os");
var hostname = os.hostname();

const getEnvDomain = () => {
    let url = "";
    const production = process.env.NODE_ENV === 'production';
    if(hostname){ // server is asking
        if(hostname.includes("ms-strazsiko")){// production
            const protocol = (production)? "https" : "http";
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

export const checkIfLettersSlashUnderscoreUndef = (words: string | Array<string>) => {
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