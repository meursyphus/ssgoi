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

// Next.js 16 Cache Components wraps every route in <Activity>, so a previous
// route stays mounted as `display: none` on client-side navigation instead of
// unmounting. ssgoi's visibility-observer hooks the resulting style toggle
// and animates the hidden/visible transitions in place.
//
// Gated behind SSGOI_ACTIVITY=1 because turning Cache Components on is also a
// repo-wide migration (every dynamic data access needs to live inside
// <Suspense>, or behind `use cache`), and the docs site hasn't been ported
// yet. Set the env var locally to exercise the Activity integration; default
// builds stay on the unmount-driven path.
const activityEnabled = process.env.SSGOI_ACTIVITY === "1";

const nextConfig: NextConfig = {
  ...(activityEnabled ? { cacheComponents: true } : {}),
  allowedDevOrigins: devHosts,
  experimental: {
    serverActions: {
      allowedOrigins: devHosts.flatMap((host) => [host, `${host}:${devPort}`]),
    },
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
