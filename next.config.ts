import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["drive.google.com"], // Allow images from Google Drive
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
