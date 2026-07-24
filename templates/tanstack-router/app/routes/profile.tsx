import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SsgoiTransitionBoundary } from "../components/ssgoi-transition-boundary";

export const Route = createFileRoute("/profile")({
  component: () => (
    <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiTransitionBoundary>
  ),
});
