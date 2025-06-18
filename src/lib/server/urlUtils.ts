import 'server-only'
  
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

export const getApiURL = async (url: string) => {
    let urlWithoutSlash = url.startsWith("/")? url.substring(1) : url;
    let apiUrl = getEnvDomain() + "/api/" + urlWithoutSlash;
    return apiUrl;
}