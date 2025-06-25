/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dtvjjump9/**', // replace with your actual cloud name
      },
    ],
  },
};

module.exports = nextConfig;
