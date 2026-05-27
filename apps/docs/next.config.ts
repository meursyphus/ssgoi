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
};

export default nextConfig;

initOpenNextCloudflareForDev();
