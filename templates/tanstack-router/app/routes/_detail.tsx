import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export const Route = createFileRoute("/_detail")({
  // Depth 1: detail <-> detail
  component: () => (
    <SsgoiLayoutBoundary className="flex-1 bg-[#121212]">
      <Outlet />
    </SsgoiLayoutBoundary>
  ),
});
