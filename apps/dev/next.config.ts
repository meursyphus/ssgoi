import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3 keeps recently visited App Router segments mounted under React
  // <Activity>. The /activity-next harness exercises SSGOI against those real
  // hidden/visible commits rather than a hand-written Activity component.
  cacheComponents: true,
};

export default nextConfig;
