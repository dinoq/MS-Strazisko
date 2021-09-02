
export const getEnvDomain = () => {
    const dev = process.env.NODE_ENV !== 'production';
    return (dev ? 'http://localhost:3000' : 'https://your_deployment.server.com');
}
