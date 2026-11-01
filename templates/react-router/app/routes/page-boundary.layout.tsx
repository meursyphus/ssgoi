import { Outlet } from "react-router";
import { SsgoiLayoutBoundary } from "@ssgoi/react";

export default function PageBoundaryLayout() {
  return (
    <SsgoiLayoutBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiLayoutBoundary>
  );
}
