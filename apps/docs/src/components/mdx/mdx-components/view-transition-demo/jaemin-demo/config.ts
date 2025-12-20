import { jaemin } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

// Named export for Sandpack (as 'config')
// Also exported as 'jaeminConfig' for direct imports
export const config: SsgoiConfig = {
  transitions: [
    // Use jaemin transition for all special pages (excluding settings)
    {
      from: "/jaemin",
      to: "/jaemin/premium",
      transition: jaemin(),
      symmetric: true,
    },
    {
      from: "/jaemin",
      to: "/jaemin/achievement",
      transition: jaemin(),
      symmetric: true,
    },
    {
      from: "/jaemin/premium",
      to: "/jaemin/achievement",
      transition: jaemin(),
      symmetric: true,
    },
    // Settings uses standard browser navigation (not special)
    // No transition defined = uses browser default navigation
  ],
};

// Alias for direct imports in index.tsx
export const jaeminConfig = config;
