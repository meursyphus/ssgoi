import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { networkInterfaces } from "node:os";

function getLocalNetworkHosts() {
  return Object.values(networkInterfaces())
    .flatMap((interfaces) => interfaces ?? [])
    .filter((networkInterface) => {
      return (
        networkInterface.family === "IPv4" &&
        !networkInterface.internal &&
        networkInterface.address
      );
    })
    .map((networkInterface) => networkInterface.address);
}

const devHosts =
  process.env.NODE_ENV === "development" ? getLocalNetworkHosts() : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: devHosts,
  // Keep previously-visited routes mounted (hidden via React <Activity>) on
  // client navigation instead of unmounting them. ssgoi detects the
  // display:none hide/show and runs page transitions on the real nodes,
  // so navigation animations work with cached/kept-alive pages.
  cacheComponents: true,
  async redirects() {
    return [{ source: "/showcase", destination: "/", permanent: true }];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
