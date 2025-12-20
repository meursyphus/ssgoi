/* eslint-disable @typescript-eslint/no-explicit-any */
import { HomePage, PremiumPage, AchievementPage, SettingsPage } from "./pages";

// RouteConfig type defined inline for Sandpack compatibility
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  props?: Record<string, any>;
}

// Named export for Sandpack (as 'routes')
export const routes: RouteConfig[] = [
  { path: "/jaemin", component: HomePage, label: "home" },
  { path: "/jaemin/premium", component: PremiumPage, label: "premium" },
  {
    path: "/jaemin/achievement",
    component: AchievementPage,
    label: "achievement",
  },
  { path: "/jaemin/settings", component: SettingsPage, label: "settings" },
];

// Alias for direct imports in index.tsx
export const jaeminRoutes = routes;
