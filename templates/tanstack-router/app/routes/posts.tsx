import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export const Route = createFileRoute("/posts")({
  component: () => (
    <SsgoiLayoutBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiLayoutBoundary>
  ),
});
