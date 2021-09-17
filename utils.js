
export const getEnvDomain = () => {
    const dev = process.env.NODE_ENV !== 'production';
    const defaultPort = 3000;
    return (dev ? 'http://localhost:' + (process.env.APP_PORT || defaultPort) : 'http://localhost:' + (process.env.APP_PORT || defaultPort))/*'https://your_deployment.server.com')*/;
}
