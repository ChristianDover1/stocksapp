/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

module.exports = {
  ...nextConfig,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: 'res.cloudinary.com',
        pathname: "**",
      },
    ],
  }
}
