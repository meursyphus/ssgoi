import { snap } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

// Named export for Sandpack (as 'config')
export const config: SsgoiConfig = {
  transitions: [
    // Home → Search (left direction: enters from right)
    { from: "/home", to: "/search", transition: snap({ direction: "left" }) },
    // Search → Home (right direction: enters from left)
    { from: "/search", to: "/home", transition: snap({ direction: "right" }) },
    // Search → Profile (left direction: enters from right)
    {
      from: "/search",
      to: "/profile",
      transition: snap({ direction: "left" }),
    },
    // Profile → Search (right direction: enters from left)
    {
      from: "/profile",
      to: "/search",
      transition: snap({ direction: "right" }),
    },
    // Home → Profile (left direction: enters from right)
    { from: "/home", to: "/profile", transition: snap({ direction: "left" }) },
    // Profile → Home (right direction: enters from left)
    { from: "/profile", to: "/home", transition: snap({ direction: "right" }) },
  ],
};

// Alias for direct imports
export const snapConfig = config;
