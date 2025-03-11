/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  crossOrigin: "anonymous",
  // output: "standalone",
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
    loader: "custom",
    loaderFile: "./@/lib/image-loader.js",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
