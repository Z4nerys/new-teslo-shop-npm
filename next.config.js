/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            }
        ]
    }
}
//documentacion
//https://nextjs.org/docs/messages/next-image-unconfigured-host

module.exports = nextConfig
