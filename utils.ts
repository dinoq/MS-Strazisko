
const getEnvDomain = () => {
    const dev = process.env.NODE_ENV !== 'production';
    const defaultPort = 3000;
    return (dev ? 'http://localhost:' + (process.env.APP_PORT || defaultPort) : 'http://localhost:' + (process.env.APP_PORT || defaultPort))/*'https://your_deployment.server.com')*/;
}

export const getApiURL = (url: string) => {
    let urlWithoutSlash = url.startsWith("/")? url.substring(1) : url;
    return getEnvDomain() + "/api/" + urlWithoutSlash;
}