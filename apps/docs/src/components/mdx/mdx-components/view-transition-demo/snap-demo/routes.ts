/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomePage, SearchPage, ProfilePage } from "./pages";

// RouteConfig type defined inline for Sandpack compatibility
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  props?: Record<string, any>;
}

// Named export for Sandpack (as 'routes')
export const routes: RouteConfig[] = [
  { path: "/home", component: HomePage, label: "Home" },
  { path: "/search", component: SearchPage, label: "Search" },
  { path: "/profile", component: ProfilePage, label: "Profile" },
];

// Alias for direct imports in index.tsx
export const snapRoutes = routes;
