import { Outlet } from "react-router";
import { SsgoiLayoutBoundary } from "@ssgoi/react";
import BottomNav from "../components/bottom-nav";

export default function TopLevelLayout() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Depth 1: tab <-> tab. The bottom nav stays outside, so it only moves
          when the whole top level leaves for a detail page. */}
      <SsgoiLayoutBoundary className="flex-1 flex flex-col bg-[#121212]">
        <Outlet />
      </SsgoiLayoutBoundary>
      <BottomNav />
    </div>
  );
}
