import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SsgoiRouteBoundary } from "@ssgoi/react/tanstack-router";

export const Route = createFileRoute("/profile")({
  component: () => (
    <SsgoiRouteBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiRouteBoundary>
  ),
});
