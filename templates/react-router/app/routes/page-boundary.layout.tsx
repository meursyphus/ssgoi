import { Outlet } from "react-router";
import { SsgoiRouteBoundary } from "@ssgoi/react-router";

export default function PageBoundaryLayout() {
  return (
    <SsgoiRouteBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiRouteBoundary>
  );
}
