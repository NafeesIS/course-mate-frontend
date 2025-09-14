import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['drive.google.com'],  // Allow images from Google Drive
  },
};

export default nextConfig;
