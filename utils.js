
export const getEnvDomain = () => {
    const dev = process.env.NODE_ENV !== 'production';
    return (dev ? 'http://localhost:'+(process.env.APP_PORT||80): 'https://your_deployment.server.com');
}
