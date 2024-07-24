/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:slug*',
                destination: 'http://localhost:3001/api/:slug*'
            }
        ];
    },
};

export default nextConfig;
