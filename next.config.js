/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Removed output: "export" since we use custom Express server (server.js)
  // and have dynamic admin routes that require server-side rendering
};

module.exports = nextConfig;
