import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SsgoiTransitionBoundary } from "../components/ssgoi-transition-boundary";

export const Route = createFileRoute("/pinterest")({
  component: () => (
    <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiTransitionBoundary>
  ),
});
