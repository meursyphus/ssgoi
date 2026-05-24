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
  // Wraps every route in <Activity>, so a previous route stays mounted as
  // `display: none` on client-side navigation instead of unmounting. ssgoi's
  // visibility-observer hooks the resulting style toggle and animates the
  // hidden/visible transitions in place.
  //
  // Prod build still requires a docs-wide `'use cache'` / <Suspense>
  // migration; on here for local exploration of the Activity integration.
  cacheComponents: true,
  allowedDevOrigins: devHosts,
  experimental: {
    serverActions: {
      allowedOrigins: devHosts.flatMap((host) => [host, `${host}:${devPort}`]),
    },
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
