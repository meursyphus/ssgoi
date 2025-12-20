import { sheet } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

// Named export for Sandpack (as 'config')
export const config: SsgoiConfig = {
  transitions: [
    {
      from: "/sent",
      to: "/compose",
      transition: sheet({ direction: "enter" }),
    },
    {
      from: "/compose",
      to: "/sent",
      transition: sheet({ direction: "exit" }),
    },
  ],
};

// Alias for direct imports
export const sheetConfig = config;
