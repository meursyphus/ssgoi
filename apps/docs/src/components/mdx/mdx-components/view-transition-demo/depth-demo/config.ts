import { depth } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

// Named export for Sandpack (as 'config')
export const config: SsgoiConfig = {
  transitions: [
    {
      from: "/home",
      to: "/search",
      transition: depth({ direction: "enter" }),
    },
    {
      from: "/search",
      to: "/home",
      transition: depth({ direction: "exit" }),
    },
  ],
};

// Alias for direct imports
export const depthConfig = config;
