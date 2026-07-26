import { Outlet } from "react-router";
import { SsgoiRouteBoundary } from "../components/ssgoi-route-boundary";

export default function PageBoundaryLayout() {
  return (
    <SsgoiRouteBoundary name="page" className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiRouteBoundary>
  );
}
