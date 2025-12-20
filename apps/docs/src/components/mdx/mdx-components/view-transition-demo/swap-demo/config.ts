import { swap } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

// Named export for Sandpack (as 'config')
export const config: SsgoiConfig = {
  defaultTransition: swap(),
};

// Alias for direct imports
export const swapConfig = config;
