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
    return getEnvDomain() + "/api/" + urlWithoutSlash;
}