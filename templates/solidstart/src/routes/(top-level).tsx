import type { JSX } from "solid-js";
import { SsgoiLayoutBoundary } from "@ssgoi/solid";
import { BottomNav } from "../components/bottom-nav";

export default function TopLevelLayout(props: { children?: JSX.Element }) {
  return (
    <div class="flex-1 flex flex-col">
      {/* Depth 1: only the tab content moves between tabs. */}
      <SsgoiLayoutBoundary class="flex-1 flex flex-col bg-[#121212]">
        {props.children}
      </SsgoiLayoutBoundary>

      {/* Outside the depth-1 boundary, inside the depth-0 one. */}
      <BottomNav />
    </div>
  );
}
