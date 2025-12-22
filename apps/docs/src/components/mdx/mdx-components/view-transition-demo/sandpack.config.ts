/**
 * Sandpack Demo Configuration
 *
 * Register demos that should generate Sandpack templates.
 * Only demos with the folder structure will be processed:
 * - content.ts
 * - config.ts
 * - pages.tsx
 * - layout.tsx
 * - routes.ts
 */

export const SANDPACK_DEMOS = [
  "jaemin-demo",
  "film-demo",
  "sheet-demo",
  "depth-demo",
  "swap-demo",
  "snap-demo",
  // Add more demos here as they are migrated to folder structure
] as const;

export type SandpackDemoName = (typeof SANDPACK_DEMOS)[number];
