import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SsgoiRouteBoundary } from "../components/ssgoi-route-boundary";

export const Route = createFileRoute("/posts")({
  component: () => (
    <SsgoiRouteBoundary name="page" className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiRouteBoundary>
  ),
});
