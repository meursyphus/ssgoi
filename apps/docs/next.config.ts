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
const devPort = process.env.PORT ?? "3000";

const nextConfig: NextConfig = {
  allowedDevOrigins: devHosts,
  experimental: {
    serverActions: {
      allowedOrigins: devHosts.flatMap((host) => [host, `${host}:${devPort}`]),
    },
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
