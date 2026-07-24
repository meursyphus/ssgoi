import { Outlet } from "react-router";
import { SsgoiTransitionBoundary } from "../components/ssgoi-transition-boundary";

export default function PageBoundaryLayout() {
  return (
    <SsgoiTransitionBoundary className="min-h-full bg-[#121212]">
      <Outlet />
    </SsgoiTransitionBoundary>
  );
}
