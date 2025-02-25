/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/7.x/avataaars/svg',
            },
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    env: {
        NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
        NEXT_PUBLIC_RESELLER_API_URL: process.env.NEXT_PUBLIC_RESELLER_API_URL,
        NEXT_PUBLIC_AUTH_PATH: process.env.NEXT_PUBLIC_AUTH_PATH,
        NEXT_PUBLIC_RESELLER_PATH: process.env.NEXT_PUBLIC_RESELLER_PATH,
    },
};

export default nextConfig;
