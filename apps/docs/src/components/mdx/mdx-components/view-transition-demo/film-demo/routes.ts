/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scene1Page, Scene2Page, Scene3Page } from "./pages";

// RouteConfig type defined inline for Sandpack compatibility
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  props?: Record<string, any>;
}

// Named export for Sandpack (as 'routes')
export const routes: RouteConfig[] = [
  { path: "/film", component: Scene1Page, label: "scene1" },
  { path: "/film/scene-2", component: Scene2Page, label: "scene2" },
  { path: "/film/scene-3", component: Scene3Page, label: "scene3" },
];

// Alias for direct imports in index.tsx
export const filmRoutes = routes;
