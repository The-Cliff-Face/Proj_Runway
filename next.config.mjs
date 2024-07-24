/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:slug*',
                destination: 'https://projectrunway.tech:3001/api/:slug*'
            }
        ];
    },
};

export default nextConfig;
