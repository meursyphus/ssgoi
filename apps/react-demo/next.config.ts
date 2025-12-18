import type { NextConfig } from "next";
import SsgoiAutoKey from "@ssgoi/react/unplugin/webpack";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.plugins.push(SsgoiAutoKey());
    return config;
  },
};

export default nextConfig;
