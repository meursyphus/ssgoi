/* eslint-disable @typescript-eslint/no-explicit-any */
import { SentEmailsPage, ComposeEmailPage } from "./pages";

// RouteConfig type defined inline for Sandpack compatibility
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label?: string;
  props?: Record<string, any>;
}

// Named export for Sandpack (as 'routes')
export const routes: RouteConfig[] = [
  { path: "/sent", component: SentEmailsPage, label: "Sent" },
  { path: "/compose", component: ComposeEmailPage, label: "New Message" },
];

// Alias for direct imports in index.tsx
export const sheetRoutes = routes;
