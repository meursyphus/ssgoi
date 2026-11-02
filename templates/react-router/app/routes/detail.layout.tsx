import { Outlet } from "react-router";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function DetailLayout() {
  return (
    // Depth 1: detail <-> detail
    <SsgoiLayoutBoundary className="flex-1 bg-[#121212]">
      <Outlet />
    </SsgoiLayoutBoundary>
  );
}
