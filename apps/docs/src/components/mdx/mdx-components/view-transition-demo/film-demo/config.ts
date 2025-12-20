import { film } from "@ssgoi/react/view-transitions";
import type { SsgoiConfig } from "@ssgoi/react";

// Named export for Sandpack (as 'config')
export const config: SsgoiConfig = {
  transitions: [
    {
      from: "/film",
      to: "/film/scene-2",
      transition: film(),
      symmetric: true,
    },
    {
      from: "/film",
      to: "/film/scene-3",
      transition: film(),
      symmetric: true,
    },
    {
      from: "/film/scene-2",
      to: "/film/scene-3",
      transition: film(),
      symmetric: true,
    },
  ],
};

// Alias for direct imports
export const filmConfig = config;
